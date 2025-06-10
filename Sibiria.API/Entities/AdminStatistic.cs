using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sibiria.API.Entities
{
    public class AdminStatistic
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        /// <summary>
        /// Уровень занятости номеров (%) — пример: 75.00
        /// </summary>
        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal OccupancyRate { get; set; }

        /// <summary>
        /// Количество посетителей за месяц
        /// </summary>
        [Required]
        public int TotalVisitors { get; set; }

        /// <summary>
        /// Производительность (%) — пример: 120.50
        /// </summary>
        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal Performance { get; set; }

        /// <summary>
        /// Общее количество бронирований
        /// </summary>
        [Required]
        public int TotalBookings { get; set; }

        /// <summary>
        /// Количество доступных номеров на эту дату
        /// </summary>
        [Required]
        public int AvailableRooms { get; set; }

        /// <summary>
        /// Общий доход (сумма)
        /// </summary>
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalRevenue { get; set; }
    }
}
