using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sibiria.API.DTOs
{
    public class AdminStatisticDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public decimal OccupancyRate { get; set; }
        public int TotalVisitors { get; set; }
        public decimal Performance { get; set; }
        public int TotalBookings { get; set; }
        public int AvailableRooms { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}
