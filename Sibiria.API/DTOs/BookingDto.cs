using System;
using System.Collections.Generic;

namespace Sibiria.API.DTOs
{
    public class BookingDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoomId { get; set; }
        public string RoomName { get; set; }
        public string ImageUrl { get; set; }
        public decimal Total { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; }

        // Новое поле:
        public List<ServiceDto> Services { get; set; } = new List<ServiceDto>();
    }
}
