using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sibiria.API.Data;
using Sibiria.API.DTOs;
using Sibiria.API.Entities;
using Sibiria.API.Enums;
using Sibiria.API.Interfaces;

namespace Sibiria.API.Services
{
    public class RoomService : IRoomService
    {
        private readonly SibiriaContext _context;

        public RoomService(SibiriaContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Создаёт новую комнату, сериализуя List<string> -> JSON.
        /// </summary>
        public async Task<RoomDto> CreateAsync(RoomDto roomDto)
        {
            if (roomDto == null)
                throw new ArgumentNullException(nameof(roomDto));

            // Сериализуем списки в JSON-строки
            string amenitiesJson = JsonSerializer.Serialize(roomDto.Amenities ?? new List<string>());
            string imageUrlsJson = JsonSerializer.Serialize(roomDto.ImageUrls ?? new List<string>());

            var room = new Room
            {
                Capacity = roomDto.Capacity,
                Amenities = amenitiesJson,
                Description = roomDto.Description,
                ImageUrls = imageUrlsJson,
                Price = roomDto.Price,
                RoomTypeId = roomDto.RoomTypeId,
                Status = RoomStatus.Available,
                Title = roomDto.Title
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            // Вызвано SaveChangesAsync → у room.Id теперь есть значение
            roomDto.Id = room.Id;
            roomDto.Status = room.Status.ToString();
            return roomDto;
        }

        /// <summary>
        /// Удаляет комнату по Id (если найдена).
        /// </summary>
        public async Task DeleteAsync(int id)
        {
            var roomToDelete = await _context.Rooms
                .FirstOrDefaultAsync(r => r.Id == id);

            if (roomToDelete != null)
            {
                _context.Rooms.Remove(roomToDelete);
                await _context.SaveChangesAsync();
            }
        }

        /// <summary>
        /// Возвращает все комнаты. Сначала вытягиваем Room из БД,
        /// потом в памяти десериализуем JSON -> List<string>.
        /// </summary>
        public async Task<IEnumerable<RoomDto>> GetAllAsync()
        {
            // 1) Материализуем все сущности Room из БД
            var rooms = await _context.Rooms
                .AsNoTracking()
                .ToListAsync();

            // 2) В памяти мапим каждую Room в RoomDto
            var result = rooms.Select(r => new RoomDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                Price = r.Price,
                Capacity = r.Capacity,
                RoomTypeId = r.RoomTypeId,
                Status = r.Status.ToString(),

                // Здесь мы точно в памяти, поэтому можно вызывать JsonSerializer
                Amenities = string.IsNullOrWhiteSpace(r.Amenities)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(r.Amenities),

                ImageUrls = string.IsNullOrWhiteSpace(r.ImageUrls)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(r.ImageUrls)
            })
            .ToList(); // собираем результат в список

            return result;
        }

        /// <summary>
        /// Возвращает комнаты, свободные на сегодняшний день, аналогично делаем материализацию,
        /// а затем в памяти десериализуем JSON -> List<string>.
        /// </summary>
        public async Task<IEnumerable<RoomDto>> GetAvailableRoomsAsync(DateTime desiredCheckIn, DateTime desiredCheckOut)
        {
            if (desiredCheckOut <= desiredCheckIn)
                throw new ArgumentException("Дата выезда должна быть строго позже даты заезда.");

            // 1) Фильтруем комнаты, у которых нет назначенных подтверждённых бронирований,
            //    которые пересекаются с [desiredCheckIn, desiredCheckOut).
            //    Логика «пересечения»:
            //      b.CheckIn < desiredCheckOut  &&  b.CheckOut > desiredCheckIn
            //
            var rooms = await _context.Rooms
                .Where(r => !r.Bookings.Any(b =>
                    b.Status == BookingStatus.Confirmed
                    && b.CheckIn < desiredCheckOut
                    && b.CheckOut > desiredCheckIn
                ))
                .AsNoTracking()
                .ToListAsync();

            // 2) В памяти преобразуем JSON-поля (Amenities, ImageUrls) и собираем DTO
            var result = rooms.Select(r => new RoomDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                Price = r.Price,
                Capacity = r.Capacity,
                RoomTypeId = r.RoomTypeId,
                Status = r.Status.ToString(),

                Amenities = string.IsNullOrWhiteSpace(r.Amenities)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(r.Amenities),

                ImageUrls = string.IsNullOrWhiteSpace(r.ImageUrls)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(r.ImageUrls)
            })
            .ToList();

            return result;
        }


        /// <summary>
        /// Возвращает комнату по Id. Сначала получаем Room из БД, 
        /// затем десериализуем JSON-поля.
        /// </summary>
        public async Task<RoomDto> GetByIdAsync(int id)
        {
            // 1) Материализуем сущность из БД
            var room = await _context.Rooms
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
                return null;

            // 2) В памяти десериализуем JSON -> List<string>
            var dto = new RoomDto
            {
                Id = room.Id,
                Title = room.Title,
                Description = room.Description,
                Price = room.Price,
                Capacity = room.Capacity,
                RoomTypeId = room.RoomTypeId,
                Status = room.Status.ToString(),

                Amenities = string.IsNullOrWhiteSpace(room.Amenities)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(room.Amenities),

                ImageUrls = string.IsNullOrWhiteSpace(room.ImageUrls)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(room.ImageUrls)
            };

            return dto;
        }

        public async Task<IEnumerable<RoomDto>> GetAvailableAsync(
     DateTime checkIn,
     DateTime checkOut,
     int? roomTypeId,
     int guests)
        {
            if (checkIn >= checkOut)
                throw new ArgumentException("Дата заезда должна быть раньше даты выезда.");
            if (guests < 1)
                throw new ArgumentException("Количество гостей должно быть >= 1.");

            // 1. Фильтруем комнаты по capacity и (опционально) по roomTypeId
            var query = _context.Rooms
                .Include(r => r.Bookings)
                .Where(r => r.Capacity >= guests);

            if (roomTypeId.HasValue)
            {
                query = query.Where(r => r.RoomTypeId == roomTypeId.Value);
            }

            // 2. Исключаем комнаты, в которых есть пересекающиеся подтверждённые брони
            query = query.Where(r =>
                !r.Bookings.Any(b =>
                    b.Status == BookingStatus.Confirmed
                    && b.CheckIn < checkOut
                    && b.CheckOut > checkIn
                )
            );

            // 3. Вытаскиваем список сущностей из БД
            var rooms = await query.AsNoTracking().ToListAsync();

            // 4. Далее в памяти преобразуем каждую Room в RoomDto, десериализуя JSON-поля
            var result = rooms.Select(r => new RoomDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                Capacity = r.Capacity,
                Price = r.Price,
                RoomTypeId = r.RoomTypeId,
                Status = r.Status.ToString(),
                Amenities = string.IsNullOrWhiteSpace(r.Amenities)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(r.Amenities)!,
                ImageUrls = string.IsNullOrWhiteSpace(r.ImageUrls)
                    ? new List<string>()
                    : JsonSerializer.Deserialize<List<string>>(r.ImageUrls)!
            }).ToList();

            return result;
        }


        /// <summary>
        /// Обновляет существующую комнату (PUT/PATCH). 
        /// Сначала забираем Room из БД, присваиваем новые значения и сериализуем списки.
        /// </summary>
        public async Task UpdateAsync(RoomDto roomDto)
        {
            if (roomDto == null)
                throw new ArgumentNullException(nameof(roomDto));

            // 1) Получаем сущность из БД
            var roomToUpdate = await _context.Rooms
                .FirstOrDefaultAsync(r => r.Id == roomDto.Id);

            if (roomToUpdate == null)
                return;

            // 2) Обновляем простые поля
            roomToUpdate.Title = roomDto.Title;
            roomToUpdate.Description = roomDto.Description;
            roomToUpdate.Price = roomDto.Price;
            roomToUpdate.Capacity = roomDto.Capacity;
            roomToUpdate.RoomTypeId = roomDto.RoomTypeId;

            // Если вы хотите позволить менять статус из DTO,
            // можно сделать так:
            // roomToUpdate.Status = Enum.Parse<RoomStatus>(roomDto.Status);
            //
            // В примере ниже просто переводим в Available:
            roomToUpdate.Status = RoomStatus.Available;

            // 3) Сериализуем списки из DTO обратно в JSON-строки
            roomToUpdate.Amenities = JsonSerializer.Serialize(roomDto.Amenities ?? new List<string>());
            roomToUpdate.ImageUrls = JsonSerializer.Serialize(roomDto.ImageUrls ?? new List<string>());

            // 4) Сохраняем изменения
            await _context.SaveChangesAsync();
        }
    }
}
