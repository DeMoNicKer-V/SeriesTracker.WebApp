namespace SeriesTracker.Infrastructure.Authentication
{
    /// <summary>
    /// Настройки для JWT (JSON Web Token).
    /// </summary>
    public class JwtOptions
    {
        /// <summary>
        /// Секретный ключ, используемый для подписи JWT.
        /// Должен быть достаточно длинным и сложным для обеспечения безопасности.
        /// </summary>
        public string SecretKey { get; set; } = string.Empty;

        /// <summary>
        /// Время истечения срока действия JWT в часах.
        /// Рекомендуется устанавливать небольшое значение для повышения безопасности.
        /// </summary>
        public int ExpiresHours { get; set; }
    }
}