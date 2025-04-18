using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Core.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SeriesTracker.Infrastructure.Authentication
{
    /// <summary>
    /// Провайдер для генерации и валидации JWT (JSON Web Token).
    /// </summary>
    public class JwtProvider(IOptions<JwtOptions> jwtOptions) : IJwtProvider
    {
        private readonly JwtOptions _jwtOptions = jwtOptions.Value;

        public string GenerateToken(User user)
        {
            // Формируем Claims (утверждения) из нужных полей пользователя.
            // Claims - это пары "ключ-значение", содержащие информацию о пользователе, которая будет включена в токен.
            Claim[] claims = [
                new("userName", user.UserName), // Имя пользователя
                new("userId", user.Id.ToString()), // Уникальный идентификатор пользователя
                new("roleId", user.RoleId.ToString())]; // Идентификатор роли пользователя

            // Создаем SigningCredentials (учетные данные для подписи).
            // SigningCredentials используются для подписи токена с использованием секретного ключа и алгоритма шифрования.
            var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey)), // Создаем симметричный ключ из секретного ключа, хранящегося в настройках.
                SecurityAlgorithms.HmacSha256); // Используем алгоритм HMAC SHA256 для подписи.

            // Создаем JwtSecurityToken (JSON Web Token).
            // JwtSecurityToken - это объект, представляющий JWT.
            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer, // Указываем издателя
                audience: _jwtOptions.Audience, // Указываем аудиторию
                claims: claims, // Утверждения, которые будут включены в токен.
                signingCredentials: signingCredentials, // Учетные данные для подписи токена.
                expires: DateTime.UtcNow.AddHours(_jwtOptions.ExpiresHours)); // Время истечения срока действия токена (получено из настроек).

            // Преобразуем JwtSecurityToken в строку.
            // JwtSecurityTokenHandler используется для сериализации и десериализации JWT.
            var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

            return tokenValue; // Возвращаем JWT в виде строки.
        }

        public ClaimsPrincipal ValidateToken(string token)
        {
            // Проверка наличия токена.
            if (string.IsNullOrEmpty(token))
            {
                throw new ArgumentException("Token is required"); // Если токен отсутствует, выбрасываем исключение.
            }

            // Настраиваем ключ проверки подписи.
            // Ключ проверки подписи используется для проверки подписи токена и убеждения, что токен не был подделан.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey)); // Создаем симметричный ключ из секретного ключа, хранящегося в настройках.

            // Создаем параметры проверки токена.
            // TokenValidationParameters определяют, как должен быть проверен токен.
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true, // Указываем, что нужно проверять ключ подписи.
                IssuerSigningKey = key, // Указываем ключ подписи.
                ValidateIssuer = true, // Включаем проверку издателя (Issuer).
                ValidateAudience = true, // Включаем проверку аудитории (Audience).
                ValidateLifetime = true, // Указываем, что нужно проверять срок действия токена.
                ClockSkew = TimeSpan.Zero // Устанавливаем ClockSkew (разницу во времени между серверами) в ноль.
            };

            // Декодируем и проверяем токен.
            // JwtSecurityTokenHandler используется для десериализации JWT и проверки его подписи и срока действия.
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, validationParameters, out _); // Валидируем токен и получаем ClaimsPrincipal.

            return principal; // Возвращаем ClaimsPrincipal, представляющий пользователя.
        }
    }
}