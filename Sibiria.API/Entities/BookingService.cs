using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sibiria.API.Entities
{
    public class BookingService
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey(nameof(Booking))]
        public int BookingId { get; set; }
        public Booking Booking { get; set; }

        [Required]
        [ForeignKey(nameof(Service))]
        public int ServiceId { get; set; }
        public Service Service { get; set; }
    }
}
