// Sibiria.API/Services/BookingService.cs

using Microsoft.EntityFrameworkCore;
using Sibiria.API.Data;
using Sibiria.API.DTOs;
using Sibiria.API.Entities;
using Sibiria.API.Enums;
using Sibiria.API.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sibiria.API.Services
{
    public class BookingService : IBookingService
    {
        private readonly SibiriaContext _context;

        public BookingService(SibiriaContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Сохраняет гостевое бронирование без оплаты (статус WaitingConfirmation).
        /// </summary>
        public async Task<int> CreateBookingWithGuestAsync(CreateBookingDto dto)
        {
            var booking = new Booking
            {
                GuestFirstName = dto.GuestFirstName,
                GuestLastName = dto.GuestLastName,
                ContactType = dto.ContactType,
                ContactValue = dto.ContactValue,
                RoomId = dto.RoomId,
                CheckIn = dto.CheckIn,
                CheckOut = dto.CheckOut,
                TotalPrice = dto.TotalPrice,
                Status = BookingStatus.WaitingConfirmation,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            if (dto.ServiceIds != null && dto.ServiceIds.Any())
            {
                foreach (var svcId in dto.ServiceIds)
                {
                    _context.Set<Entities.BookingService>()
                            .Add(new Entities.BookingService
                            {
                                BookingId = booking.Id,
                                ServiceId = svcId
                            });
                }
                await _context.SaveChangesAsync();
            }

            return booking.Id;
        }

        /// <summary>
        /// Сохраняет гостевое бронирование + сразу запускает оплату (статус WaitingConfirmation).
        /// </summary>
        public async Task<int> CreateBookingWithGuestPaymentAsync(CreateBookingPaymentDto dto)
        {
            // Логика почти идентична CreateBookingWithGuestAsync
            var booking = new Booking
            {
                GuestFirstName = dto.GuestFirstName,
                GuestLastName = dto.GuestLastName,
                ContactType = dto.ContactType,
                ContactValue = dto.ContactValue,
                RoomId = dto.RoomId,
                CheckIn = dto.CheckIn,
                CheckOut = dto.CheckOut,
                TotalPrice = dto.TotalPrice,
                Status = BookingStatus.WaitingConfirmation,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            if (dto.ServiceIds != null && dto.ServiceIds.Any())
            {
                foreach (var svcId in dto.ServiceIds)
                {
                    _context.Set<Entities.BookingService>()
                            .Add(new Entities.BookingService
                            {
                                BookingId = booking.Id,
                                ServiceId = svcId
                            });
                }
                await _context.SaveChangesAsync();
            }

            return booking.Id;
        }

        public async Task<IEnumerable<BookingAdminDto>> GetWaitingConfirmationAsync()
        {
            var bookings = await _context.Bookings
                .Where(b => b.Status == BookingStatus.WaitingConfirmation)
                .Include(b => b.Room)
                .Include(b => b.BookingServices)
                    .ThenInclude(bs => bs.Service)
                .AsNoTracking()
                .ToListAsync();

            return bookings.Select(b => new BookingAdminDto
            {
                Id = b.Id,
                GuestFirstName = b.GuestFirstName,
                GuestLastName = b.GuestLastName,
                ContactType = b.ContactType,
                ContactValue = b.ContactValue,
                RoomId = b.RoomId,
                RoomName = b.Room.Title,
                CheckIn = b.CheckIn,
                CheckOut = b.CheckOut,
                TotalPrice = b.TotalPrice,
                Status = b.Status.ToString(),
                Services = b.BookingServices
                            .Select(bs => new ServiceDto
                            {
                                Id = bs.Service.Id,
                                Name = bs.Service.Name,
                                Description = bs.Service.Description,
                                Price = bs.Service.Price
                            })
                            .ToList()
            });
        }

        public async Task ChangeBookingStatusAsync(int bookingId, string newStatus)
        {
            if (!Enum.TryParse<BookingStatus>(newStatus, out var statusEnum))
                throw new ArgumentException("Неверный статус.");

            await _context.Bookings
                .Where(b => b.Id == bookingId)
                .ExecuteUpdateAsync(s => s.SetProperty(b => b.Status, statusEnum));
        }
    }
}
