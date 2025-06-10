using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sibiria.API.Enums;

namespace Sibiria.API.Entities
{
    public class Room
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(RoomType))]
        public int RoomTypeId { get; set; }
        public RoomType RoomType { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Required]
        public int Capacity { get; set; }

        /// <summary>
        /// JSON-строка с массивом удобств (например: ["WiFi","TV"])
        /// </summary>
        [Column(TypeName = "jsonb")]
        public string Amenities { get; set; }

        /// <summary>
        /// JSON-строка с массивом URL-адресов изображений
        /// </summary>
        [Column(TypeName = "jsonb")]
        public string ImageUrls { get; set; }

        [Required]
        public RoomStatus Status { get; set; }

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
