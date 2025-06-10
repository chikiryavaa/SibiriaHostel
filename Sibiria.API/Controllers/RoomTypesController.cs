using Microsoft.AspNetCore.Mvc;
using Sibiria.API.DTOs;
using Sibiria.API.Interfaces;
using Sibiria.API.Services;

namespace Sibiria.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomTypesController : Controller
    {
        private readonly IRoomTypeService _roomTypeService;
        public RoomTypesController(IRoomTypeService roomTypeService)
        {
            _roomTypeService = roomTypeService;
        }
        [HttpPost]
        public async Task<IActionResult> AddRoomType([FromBody] RoomTypeDto roomTypeDto)
        {
            return Ok(await _roomTypeService.AddRoomType(roomTypeDto));  
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRoomTypes()
        {
            return Ok(await _roomTypeService.GetAllRoomTypes());
        }
    }
}
