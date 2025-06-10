using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Sibiria.API.DTOs;
using Sibiria.Core.Entities;
using Sibiria.API.Data;
using Sibiria.API.Services;
using Sibiria.API.Interfaces;

namespace Sibiria.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly JwtService _service;

        public UserController(IUserService userService,JwtService service)
        {
            _userService = userService;
            _service = service;

        }

        // GET: api/user
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] LoginRequestDto loginRequestDto)
                {
            var result = await _userService.GetUserByEmailAndPasword(loginRequestDto);
            if (result == null)
                return Unauthorized("Пользователя с таким логином и паролем не существует");
          
            var token = _service.GenerateJwtToken(result);

            return Ok(new {token});
        }

        // GET: api/user/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST: api/user
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (await _userService.GetByEmailAsync(dto.Email) != null)
                return BadRequest("Пользователь с таким Email уже зарегистрирован");

            var createdUser = await _userService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
        }

        // POST: api/user/request-reset
        [HttpPost("request-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] RequestPasswordResetDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email))
                return BadRequest("Email обязателен");

            // Генерируем токен, сохраняем его в поля пользователя
            var token = await _userService.GeneratePasswordResetTokenAsync(dto.Email);

            // Независимо от того, существует ли email, возвращаем 200,
            // чтобы не выдавать информацию о наличии/отсутствии аккаунта.
            return Ok(new { message = "Если указанный email зарегистрирован, вы получите код сброса." });
        }

        // POST: api/user/confirm-reset
        [HttpPost("confirm-reset")]
        public async Task<IActionResult> ConfirmPasswordReset([FromBody] ConfirmPasswordResetDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email) ||
                string.IsNullOrEmpty(dto.Code) ||
                string.IsNullOrEmpty(dto.NewPassword))
            {
                return BadRequest("Email, код и новый пароль обязательны.");
            }

            // Проверяем валидность токена
            var isValid = await _userService.ValidatePasswordResetTokenAsync(dto.Email, dto.Code);
            if (!isValid)
                return BadRequest("Неверный код или срок его действия истёк.");

            // Сбрасываем пароль
            var reset = await _userService.ResetPasswordAsync(dto.Email, dto.NewPassword);
            if (!reset)
                return StatusCode(500, "Не удалось сбросить пароль. Попробуйте позже.");

            return Ok(new { message = "Пароль успешно изменён." });
        }


    }
}
