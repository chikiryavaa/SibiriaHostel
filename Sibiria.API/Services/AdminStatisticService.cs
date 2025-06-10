// Sibiria.API/Services/AdminStatisticService.cs

using Microsoft.EntityFrameworkCore;
using Sibiria.API.Data;
using Sibiria.API.Entities;
using Sibiria.API.Interfaces;
using Sibiria.API.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sibiria.API.Services
{
    public class AdminStatisticService : IAdminStatisticService
    {
        private readonly SibiriaContext _context;

        public AdminStatisticService(SibiriaContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Рассчитывает статистику за указанный месяц и сохраняет её в таблицу AdminStatistics.
        /// </summary>
        public async Task<AdminStatistic> CalculateMonthlyStatisticAsync(int year, int month)
        {
            // Границы периода (UTC)
            var startDate = new DateTime(year, month, 1).ToUniversalTime();
            var endDate = startDate.AddMonths(1);

            // Берём все бронирования, пересекающиеся с периодом [startDate, endDate)
            var bookings = await _context.Bookings
                .Where(b => b.CheckIn < endDate && b.CheckOut > startDate)
                .ToListAsync();

            // Все номера
            var rooms = await _context.Rooms.ToListAsync();
            int roomCount = rooms.Count;
            int daysInMonth = DateTime.DaysInMonth(year, month);

            // Общее количество «ночей» всех номеров (число номеров × дней в месяце)
            int totalRoomNights = roomCount * daysInMonth;

            // Подсчитываем, сколько ночей было занято:
            int occupiedNights = bookings.Sum(b =>
            {
                // Начало перекрытия: либо CheckIn (если >= startDate), либо startDate
                var overlapStart = b.CheckIn < startDate ? startDate : b.CheckIn;
                // Конец перекрытия: либо CheckOut (если <= endDate), либо endDate
                var overlapEnd = b.CheckOut > endDate ? endDate : b.CheckOut;
                return Math.Max(0, (overlapEnd - overlapStart).Days);
            });

            // Суммарный доход за все эти бронирования (TotalPrice уже хранит полную стоимость брони)
            var revenue = bookings.Sum(b => b.TotalPrice);

            // Средняя цена номера (прошлый расчет условный, можно любым способом)
            var avgRoomPrice = rooms.Any() ? rooms.Average(r => r.Price) : 0m;
            var maxRevenue = roomCount * daysInMonth * avgRoomPrice;

            // Подсчитаем «уникальных посетителей» по ContactValue (предполагаем, что ContactValue уникален)
            var totalVisitors = bookings
                .Select(b => b.ContactValue)
                .Where(val => !string.IsNullOrWhiteSpace(val))
                .Distinct()
                .Count();

            var statistic = new AdminStatistic
            {
                Date = startDate, // будет храниться первым днём месяца
                OccupancyRate = totalRoomNights == 0
                    ? 0
                    : Math.Round((decimal)occupiedNights / totalRoomNights * 100m, 2),

                TotalVisitors = totalVisitors,

                Performance = maxRevenue == 0
                    ? 0
                    : Math.Round(revenue / maxRevenue * 100m, 2),

                TotalBookings = bookings.Count,

                // Количество свободных номеров (имеют статус Available в таблице Room)
                AvailableRooms = rooms.Count(r => r.Status == RoomStatus.Available),

                TotalRevenue = revenue
            };

            _context.AdminStatistics.Add(statistic);
            await _context.SaveChangesAsync();

            return statistic;
        }

        /// <summary>
        /// Возвращает все сохранённые статистические записи, отсортированные по дате (убывание).
        /// </summary>
        public async Task<List<AdminStatistic>> GetAllStatisticsAsync()
        {
            return await _context.AdminStatistics
                .OrderByDescending(s => s.Date)
                .ToListAsync();
        }
    }
}
