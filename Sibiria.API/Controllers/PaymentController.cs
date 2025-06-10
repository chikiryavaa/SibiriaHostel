using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Polly;
using Sibiria.API.DTOs;
using Sibiria.API.Entities;
using Sibiria.API.Interfaces;
using Sibiria.API.Services;

namespace Sibiria.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly YooKassaService _yooKassaService;
    private readonly IBookingService _bookingService;

    public PaymentsController(YooKassaService yooKassaService,IBookingService bookingService)
    {
        _yooKassaService = yooKassaService;
        _bookingService = bookingService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequestDto dto)
    {
        try
        {
            var kassaData = await _yooKassaService.CreatePayment(dto.Amount, dto.ReturnUrl, dto.Description);
            Console.WriteLine(kassaData.Item2);
            var confirmationUrl = kassaData.Item1;
            return Ok(new { confirmationUrl });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    

}
