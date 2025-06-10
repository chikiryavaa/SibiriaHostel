// Sibiria.API/DTOs/BookingAdminDto.cs
using System;
using System.Collections.Generic;
using Sibiria.API.Entities;
using Sibiria.API.Enums;

namespace Sibiria.API.DTOs
{
    public class BookingAdminDto
    {
        public int Id { get; set; }
        public string GuestFirstName { get; set; }
        public string GuestLastName { get; set; }
        public ContactType ContactType { get; set; }
        public string ContactValue { get; set; }
        public int RoomId { get; set; }
        public string RoomName { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; }
        public List<ServiceDto> Services { get; set; } = new();
    }
}
