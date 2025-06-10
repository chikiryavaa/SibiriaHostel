// Sibiria.API/Entities/Booking.cs
using Sibiria.API.Enums;
using Sibiria.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sibiria.API.Entities
{
    public enum ContactType
    {
        Phone,
        Email,
        Telegram
    }

    public class Booking
    {
        [Key]
        public int Id { get; set; }

        // Вместо UserId теперь - поля гостя:
        [Required]
        [MaxLength(100)]
        public string GuestFirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string GuestLastName { get; set; }

        [Required]
        public ContactType ContactType { get; set; }

        [Required]
        [MaxLength(255)]
        public string ContactValue { get; set; }

        // Ссылка на комнату:
        [Required]
        [ForeignKey(nameof(Room))]
        public int RoomId { get; set; }
        public Room Room { get; set; }

        [Required]
        public DateTime CheckIn { get; set; }

        [Required]
        public DateTime CheckOut { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalPrice { get; set; }

        [Required]
        public BookingStatus Status { get; set; }  // теперь WaitingConfirmation вместо Confirmed

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<BookingService> BookingServices { get; set; } = new List<BookingService>();
        public Payment Payment { get; set; }
    }
}
