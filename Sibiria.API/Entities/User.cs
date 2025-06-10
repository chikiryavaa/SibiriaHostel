using Sibiria.API.Enums;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Sibiria.API.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string FullName { get; set; }

        [Required]
        [MaxLength(255)]
        public string Email { get; set; }

        [Required]
        [MaxLength(20)]
        public string Phone { get; set; }

        /// <summary>
        /// Хешированный пароль в формате {iterations}.{salt}.{hash}.
        /// </summary>
        [Required]
        [MaxLength(1000)]
        public string Password { get; set; }

        [Required]
        public UserRole Role { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();

        // --- Теперь эти поля nullable ---
        [MaxLength(6)]
        public string? PasswordResetToken { get; set; }

        public DateTime? PasswordResetTokenExpires { get; set; }
    }
}
