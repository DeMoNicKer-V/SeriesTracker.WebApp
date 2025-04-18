namespace SeriesTracker.Application.Interfaces.Auth
{
    /// <summary>
    /// Интерфейс для сервиса хеширования паролей.
    /// Предоставляет методы для генерации хеша пароля и проверки соответствия пароля хешу.
    /// </summary>
    public interface IPasswordHasher
    {
        /// <summary>
        /// Генерирует хэш пароля.
        /// </summary>
        /// <param name="password">Пароль для хэширования.</param>
        /// <returns>Хэш пароля в виде строки (<see cref="string"/>).</returns>
        string Generate(string password);

        /// <summary>
        /// Проверяет соответствие пароля и хэша.
        /// </summary>
        /// <param name="password">Пароль для проверки.</param>
        /// <param name="hashedPassword">Хэш пароля.</param>
        /// <returns><see langword="true"/>, если пароль соответствует хэшу, иначе <see langword="false"/>.</returns>
        bool Verify(string password, string hashedPassword);
    }
}