// src/API/Controllers/RoomsController.cs

using Microsoft.AspNetCore.Mvc;
using Sibiria.API.DTOs;
using Sibiria.API.Interfaces;
using System;

namespace Sibiria.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : Controller
    {
        private readonly IRoomService _roomService;
        public RoomsController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<IActionResult> GetAllRooms()
        {
            var allRooms = await _roomService.GetAllAsync();
            return Ok(allRooms);
        }

        // GET: api/Rooms/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomById(int id)
        {
            var room = await _roomService.GetByIdAsync(id);
            if (room == null)
                return NotFound();
            return Ok(room);
        }

        // GET: api/Rooms/available?checkIn=2023-04-20T14:00:00&checkOut=2023-04-23T12:00:00&roomTypeId=2&guests=3
[HttpGet("available")]
public async Task<IActionResult> GetAvailable(
    [FromQuery] DateTime checkIn,
    [FromQuery] DateTime checkOut,
    [FromQuery] int? roomTypeId,
    [FromQuery] int guests)
{
    // Валидация входных параметров
    if (checkIn == default || checkOut == default)
        return BadRequest("Параметры checkIn и checkOut обязательны и должны быть валидными датами.");

    if (checkIn >= checkOut)
        return BadRequest("Дата заезда должна быть раньше даты выезда.");

    if (guests < 1)
        return BadRequest("Количество гостей должно быть >= 1.");

    // Приводим incoming DateTime к UTC (в запросах к PostgreSQL через Npgsql важно выставить Kind=Utc)
    var checkInUtc = DateTime.SpecifyKind(checkIn, DateTimeKind.Utc);
    var checkOutUtc = DateTime.SpecifyKind(checkOut, DateTimeKind.Utc);

    try
    {
        // Вызываем сервис, который вернёт только свободные комнаты на указанный промежуток
        // с учётом roomTypeId (если передан) и количества гостей
        var availableRooms = await _roomService.GetAvailableAsync( checkInUtc, checkOutUtc, roomTypeId, guests  
        );

        // Если закрытых DTO нет (например, не найден ни один номер), можно вернуть пустой список
        return Ok(availableRooms);
    }
    catch (ArgumentException ex)
    {
        // Если сервис выбросил ошибку из-за некорректных данных
        return BadRequest(ex.Message);
    }
    catch
    {
        // Любая другая внутренняя ошибка
        return StatusCode(500, "Внутренняя ошибка сервера при попытке найти свободные номера.");
    }
}

        // POST: api/Rooms
        [HttpPost]
        public async Task<IActionResult> AddRoom([FromBody] RoomDto roomDto)
        {
            if (roomDto == null)
                return BadRequest("Room is null");

            await _roomService.CreateAsync(roomDto);
            return Ok(roomDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] RoomDto roomDto)
        {
            if (roomDto == null || roomDto.Id != id)
                return BadRequest("Неправильный ID или тело запроса.");

            // Ваш сервис обновит сущность и сохранит в БД
            await _roomService.UpdateAsync(roomDto);
            return NoContent();
        }
    }
}
