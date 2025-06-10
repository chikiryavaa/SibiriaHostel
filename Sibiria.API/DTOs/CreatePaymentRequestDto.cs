// Sibiria.API/DTOs/CreatePaymentRequestDto.cs
using System.ComponentModel.DataAnnotations;

namespace Sibiria.API.DTOs
{
    public class CreatePaymentRequestDto
    {
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        [Url]
        public string ReturnUrl { get; set; }

        /// <summary>
        /// Можно передать, например, ID бронирования или любое описание.
        /// </summary>
        public string Description { get; set; }
    }
}
