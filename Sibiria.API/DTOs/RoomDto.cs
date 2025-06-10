using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sibiria.API.DTOs
{
    public class RoomDto
    {
        public int Id { get; set; }
        public int RoomTypeId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Capacity { get; set; }
        public List<string> Amenities { get; set; }
        public List<string> ImageUrls { get; set; }
        public string Status { get; set; }
    }
}
