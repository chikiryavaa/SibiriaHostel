// Sibiria.API/Interfaces/IUserService.cs
using Sibiria.API.DTOs;
using Sibiria.API.Entities;

using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sibiria.API.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto> GetByIdAsync(int id);
        Task<UserDto> CreateAsync(UserDto userDto);
        Task<UserDto> GetUserByEmailAndPasword(LoginRequestDto loginRequestDto);
        Task UpdateAsync(UserDto userDto);
        Task<User> DeleteAsync(int id);
        Task<UserDto> GetByEmailAsync(string email);

        // Методы для сброса пароля
        Task<string> GeneratePasswordResetTokenAsync(string email);
        Task<bool> ValidatePasswordResetTokenAsync(string email, string token);
        Task<bool> ResetPasswordAsync(string email, string newPassword);
    }
}
