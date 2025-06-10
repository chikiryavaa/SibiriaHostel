// Sibiria.API/Services/UserService.cs
using Microsoft.EntityFrameworkCore;

using Sibiria.API.Data;
using Sibiria.API.DTOs;
using Sibiria.API.Entities;
using Sibiria.API.Enums;
using Sibiria.API.Interfaces;
using Sibiria.API.Services.Sibiria.API.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Sibiria.API.Services
{
    public class UserService : IUserService
    {
        private readonly SibiriaContext _context;

        // Параметры для PBKDF2
        private const int _saltSize = 16;   // 128 бит
        private const int _keySize = 32;    // 256 бит
        private const int _iterations = 10000;
        private readonly EmailService _emailService;

        public UserService(SibiriaContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // ---------------------
        // Хеширование / проверка пароля
        // ---------------------
        private string HashPassword(string password)
        {
            // Генерация соли
            using var rng = new RNGCryptoServiceProvider();
            byte[] saltBytes = new byte[_saltSize];
            rng.GetBytes(saltBytes);

            // Производим PBKDF2
            using var deriveBytes = new Rfc2898DeriveBytes(password, saltBytes, _iterations, HashAlgorithmName.SHA256);
            byte[] keyBytes = deriveBytes.GetBytes(_keySize);

            // Возвращаем строку вида: {итераций}.{saltBase64}.{hashBase64}
            return $"{_iterations}.{Convert.ToBase64String(saltBytes)}.{Convert.ToBase64String(keyBytes)}";
        }

        private bool VerifyPassword(string hashedPasswordWithParams, string providedPassword)
        {
            if (string.IsNullOrEmpty(hashedPasswordWithParams))
                return false;

            var parts = hashedPasswordWithParams.Split('.', 3);
            if (parts.Length != 3) return false;

            if (!int.TryParse(parts[0], out int iterations)) return false;
            byte[] saltBytes = Convert.FromBase64String(parts[1]);
            byte[] storedKeyBytes = Convert.FromBase64String(parts[2]);

            using var deriveBytes = new Rfc2898DeriveBytes(providedPassword, saltBytes, iterations, HashAlgorithmName.SHA256);
            byte[] computedKeyBytes = deriveBytes.GetBytes(storedKeyBytes.Length);

            return CryptographicOperations.FixedTimeEquals(storedKeyBytes, computedKeyBytes);
        }

        // ---------------------
        // IUserService: базовые методы CRUD
        // ---------------------
        public async Task<UserDto> CreateAsync(UserDto userDto)
        {
            // Хешируем пароль
            var hashed = HashPassword(userDto.Password);

            var user = new User
            {
                FullName = userDto.FullName,
                Email = userDto.Email,
                Phone = userDto.Phone,
                Password = hashed,
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow,
                // PasswordResetToken и PasswordResetTokenExpires изначально пусты
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role.ToString(),
                Password = null // не возвращаем хеш
            };
        }

        public async Task<User> DeleteAsync(int id)
        {
            var userToDelete = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (userToDelete != null)
            {
                _context.Users.Remove(userToDelete);
                await _context.SaveChangesAsync();
            }
            return userToDelete;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            return await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role.ToString(),
                    Password = null
                })
                .ToListAsync();
        }

        public async Task<UserDto> GetByEmailAsync(string email)
        {
            var u = await _context.Users
                .Where(u => u.Email == email)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role.ToString(),
                    Password = null
                })
                .FirstOrDefaultAsync();

            return u;
        }

        public async Task<UserDto> GetByIdAsync(int id)
        {
            var u = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role.ToString(),
                    Password = null
                })
                .FirstOrDefaultAsync();

            return u;
        }

        public async Task<UserDto> GetUserByEmailAndPasword(LoginRequestDto loginRequestDto)
        {
            // Сначала ищем пользователя по email
            var userEntity = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginRequestDto.Email);
            if (userEntity == null)
                return null;

            // Проверяем пароль
            bool passwordMatches = VerifyPassword(userEntity.Password, loginRequestDto.Password);
            if (!passwordMatches)
                return null;

            // Возвращаем DTO (без хеша)
            return new UserDto
            {
                Id = userEntity.Id,
                FullName = userEntity.FullName,
                Email = userEntity.Email,
                Phone = userEntity.Phone,
                Role = userEntity.Role.ToString(),
                Password = null
            };
        }

        public async Task UpdateAsync(UserDto userDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userDto.Id);
            if (user == null) return;

            user.FullName = userDto.FullName;
            user.Email = userDto.Email;
            user.Phone = userDto.Phone;

            // Если пришёл непустой Password — нужно его хешировать и обновить
            if (!string.IsNullOrEmpty(userDto.Password))
            {
                user.Password = HashPassword(userDto.Password);
            }

            await _context.SaveChangesAsync();
        }

        // ---------------------
        // Методы для сброса пароля
        // ---------------------

        public async Task<string> GeneratePasswordResetTokenAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return null;

            // Генерируем 6-значный числовой код
            using var rng = new RNGCryptoServiceProvider();
            byte[] tokenData = new byte[4];
            rng.GetBytes(tokenData);
            int numericCode = Math.Abs(BitConverter.ToInt32(tokenData, 0)) % 1000000;
            string token = numericCode.ToString("D6"); // всегда 6 цифр

            // Сохраняем токен и время истечения (UTC)
            user.PasswordResetToken = token;
            user.PasswordResetTokenExpires = DateTime.UtcNow.AddMinutes(15);

            await _context.SaveChangesAsync();

            // Здесь можно отправить email через IEmailService (если он есть):
            await _emailService.SendPasswordResetCodeAsync(email, token);

            return token;
        }

        public async Task<bool> ValidatePasswordResetTokenAsync(string email, string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return false;

            if (string.IsNullOrEmpty(user.PasswordResetToken) || user.PasswordResetTokenExpires == null)
                return false;

            if (user.PasswordResetTokenExpires < DateTime.UtcNow)
                return false;

            return user.PasswordResetToken == token;
        }

        public async Task<bool> ResetPasswordAsync(string email, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return false;

            // Хешируем новый пароль
            user.Password = HashPassword(newPassword);

            // Инвалидируем токен (чтобы нельзя было повторно использовать)
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpires = null;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
