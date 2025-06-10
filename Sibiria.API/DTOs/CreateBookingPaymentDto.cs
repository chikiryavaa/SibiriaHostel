// Sibiria.API/DTOs/CreateBookingPaymentDto.cs
using Sibiria.API.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Sibiria.API.DTOs
{
    public class CreateBookingPaymentDto
    {
        [Required, MaxLength(100)]
        public string GuestFirstName { get; set; }

        [Required, MaxLength(100)]
        public string GuestLastName { get; set; }

        [Required]
        public ContactType ContactType { get; set; }

        [Required, MaxLength(255)]
        public string ContactValue { get; set; }

        [Required]
        public int RoomId { get; set; }

        [Required]
        public DateTime CheckIn { get; set; }

        [Required]
        public DateTime CheckOut { get; set; }

        public List<int> ServiceIds { get; set; } = new();

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal TotalPrice { get; set; }

        [Required, Url]
        public string ReturnUrl { get; set; }
    }
}
