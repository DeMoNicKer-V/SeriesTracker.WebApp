using SeriesTracker.Core.Models;
using System.Security.Claims;

namespace SeriesTracker.Application.Interfaces.Auth
{
    /// <summary>
    /// Интерфейс для сервиса работы с JWT-токенами.
    /// Предоставляет методы для генерации и валидации JWT-токенов.
    /// </summary>
    public interface IJwtProvider
    {
        /// <summary>
        /// Генерирует JWT для указанного пользователя.
        /// </summary>
        /// <param name="user">Пользователь, для которого генерируется токен.</param>
        /// <returns>JWT в виде строки (<see cref="string"/>).</returns>
        string GenerateToken(User user);

        /// <summary>
        /// Валидирует JWT и возвращает ClaimsPrincipal (набор утверждений пользователя).
        /// </summary>
        /// <param name="token">JWT в виде строки.</param>
        /// <returns><see cref="ClaimsPrincipal"/>, представляющий пользователя, если токен действителен, иначе исключение.</returns>
        /// <exception cref="ArgumentException">Выбрасывается, если токен отсутствует.</exception>
        ClaimsPrincipal ValidateToken(string token);
    }
}