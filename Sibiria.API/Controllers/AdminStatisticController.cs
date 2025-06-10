using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sibiria.API.Entities;
using Sibiria.API.Interfaces;
using Sibiria.API.Services;

[ApiController]
[Route("api/[controller]")]
//[Authorize(Roles = "Admin")]
public class AdminStatisticController : ControllerBase
{
    private readonly IAdminStatisticService _statisticService;

    public AdminStatisticController(IAdminStatisticService statisticService)
    {
        _statisticService = statisticService;
    }

    [HttpGet("generate")]
    public async Task<ActionResult<AdminStatistic>> Generate([FromQuery] int year, [FromQuery] int month)
    {
        var result = await _statisticService.CalculateMonthlyStatisticAsync(year, month);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<List<AdminStatistic>>> GetAll()
    {
        var result = await _statisticService.GetAllStatisticsAsync();
        return Ok(result);
    }
}
