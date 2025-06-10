// Sibiria.API/Controllers/BookingsController.cs

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sibiria.API.DTOs;
using Sibiria.API.Enums;
using Sibiria.API.Interfaces;
using Sibiria.API.Services;
using System;
using System.Threading.Tasks;

namespace Sibiria.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly YooKassaService _yooKassaService;

        public BookingsController(
            IBookingService bookingService,
            YooKassaService yooKassaService)
        {
            _bookingService = bookingService;
            _yooKassaService = yooKassaService;
        }

        /// <summary>
        /// POST /api/Bookings
        /// Сохраняет гостевое бронирование без оплаты (WaitingConfirmation).
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateGuestBooking([FromBody] CreateBookingDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var bookingId = await _bookingService.CreateBookingWithGuestAsync(dto);
            return Ok(new { bookingId });
        }

        /// <summary>
        /// GET /api/Bookings/waiting-confirmation
        /// Выводит все бронирования со статусом WaitingConfirmation. Только для Admin.
        /// </summary>
        [HttpGet("waiting-confirmation")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetWaitingConfirmation()
        {
            var list = await _bookingService.GetWaitingConfirmationAsync();
            return Ok(list);
        }

        /// <summary>
        /// POST /api/Bookings/create-payment
        /// Сохраняет бронирование + запускает оплату в YooKassa.
        /// </summary>
        [HttpPost("create-payment")]
        [AllowAnonymous]
        public async Task<IActionResult> CreatePayment([FromBody] CreateBookingPaymentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // 1) Сохраняем бронирование (WaitingConfirmation):
            var bookingId = await _bookingService.CreateBookingWithGuestPaymentAsync(dto);

            // 2) Формируем returnUrl?bookingId=...
            var separator = dto.ReturnUrl.Contains('?') ? "&" : "?";
            var returnUrlWithBooking = $"{dto.ReturnUrl}{separator}bookingId={bookingId}";

            try
            {
                // 3) Запускаем YooKassa
                var (confirmationUrl, paymentId) = await _yooKassaService.CreatePayment(
                    dto.TotalPrice,
                    returnUrlWithBooking,
                    description: bookingId.ToString()
                );

                return Ok(new
                {
                    bookingId,
                    paymentId,
                    confirmationUrl
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// PATCH /api/Bookings/{bookingId}/status
        /// Меняет статус бронирования (например, "Confirmed" или "Cancelled").
        /// Не требует авторизации (AllowAnonymous), чтобы фронт мог вызвать после редиректа YooKassa.
        /// </summary>
        [HttpPatch("{bookingId}/status")]
        [AllowAnonymous]
        public async Task<IActionResult> ChangeStatus(int bookingId, [FromBody] ChangeStatusDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.NewStatus))
                return BadRequest("NewStatus не задан.");

            if (!Enum.TryParse<BookingStatus>(dto.NewStatus.Trim(), out _))
                return BadRequest("Некорректный статус.");

            await _bookingService.ChangeBookingStatusAsync(bookingId, dto.NewStatus.Trim());
            return NoContent();
        }
    }
}
