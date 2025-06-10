using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Sibiria.API.Data;
using Sibiria.API.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Sibiria.API.Services
{
    public class JwtService
    {
        private readonly JwtSettings _jwtSettings;

        // Конструктор получает IOptions<JwtSettings>, из которого берёт Value
        public JwtService(IOptions<JwtSettings> jwtOptions)
        {
            _jwtSettings = jwtOptions.Value
                ?? throw new ArgumentNullException(nameof(jwtOptions), "JwtSettings не настроен");
        }

        public string GenerateJwtToken(UserDto user)
        {
            // 1. Формируем claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.MobilePhone,user.Phone)
            };

            // 2. Генерируем SigningCredentials на основе ключа
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 3. Устанавливаем срок жизни токена
            var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresInMinutes);

            // 4. Собираем сам JwtSecurityToken
            var tokenDescriptor = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            // 5. Возвращаем сериализованный токен
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
    }
}
