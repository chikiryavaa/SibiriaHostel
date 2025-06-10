// Sibiria.API/Interfaces/IBookingService.cs

using System.Collections.Generic;
using System.Threading.Tasks;
using Sibiria.API.DTOs;

namespace Sibiria.API.Interfaces
{
    public interface IBookingService
    {
        /// <summary>
        /// Сохраняет простое бронирование (без оплаты) с полями гостя.
        /// </summary>
        Task<int> CreateBookingWithGuestAsync(CreateBookingDto dto);

        /// <summary>
        /// Сохраняет бронирование + запускает оплату (Guest + платежные поля).
        /// </summary>
        Task<int> CreateBookingWithGuestPaymentAsync(CreateBookingPaymentDto dto);

        Task<IEnumerable<BookingAdminDto>> GetWaitingConfirmationAsync();

        Task ChangeBookingStatusAsync(int bookingId, string newStatus);
    }
}
