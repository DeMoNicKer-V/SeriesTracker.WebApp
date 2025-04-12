using System.ComponentModel.DataAnnotations;

namespace SeriesTracker.Infrastructure.Authentication
{
    /// <summary>
    /// Настройки для JWT (JSON Web Token).
    /// </summary>
    public class JwtOptions
    {
        /// <summary>
        /// Секретный ключ, используемый для подписи JWT.
        /// Должен быть достаточно длинным и сложным (минимум 256 бит) для обеспечения безопасности.
        /// Рассмотрите возможность хранения в Key Vault или другом безопасном хранилище секретов.
        /// </summary>
        [Required(ErrorMessage = "SecretKey is required.")]
        [MinLength(32, ErrorMessage = "SecretKey must be at least 32 characters long.")]
        public string SecretKey { get; set; } = string.Empty;

        /// <summary>
        /// Время истечения срока действия JWT в часах.
        /// Рекомендуется устанавливать небольшое значение (например, 1-2 часа) для повышения безопасности.
        /// После истечения срока действия токена пользователь должен будет повторно аутентифицироваться.
        /// </summary>
        [Range(1, 24, ErrorMessage = "ExpiresHours must be between 1 and 24.")]
        public int ExpiresHours { get; set; }

        /// <summary>
        /// Издатель JWT. Указывает, кто выпустил токен.
        /// Должен соответствовать значению, которое проверяется при валидации токена.
        /// </summary>
        [Required(ErrorMessage = "Issuer is required.")]
        public string Issuer { get; set; } = string.Empty;

        /// <summary>
        /// Аудитория JWT. Указывает, для кого предназначен токен.
        /// Должен соответствовать значению, которое проверяется при валидации токена.
        /// </summary>
        [Required(ErrorMessage = "Audience is required.")]
        public string Audience { get; set; } = string.Empty;
    }
}