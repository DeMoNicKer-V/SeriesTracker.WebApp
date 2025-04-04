using SeriesTracker.Application.Interfaces.Auth;

namespace SeriesTracker.Infrastructure.Authentication
{
    /// <summary>
    /// Класс для хэширования паролей с использованием библиотеки BCrypt.Net.
    /// </summary>
    public class PasswordHasher : IPasswordHasher
    {
        /// <summary>
        /// Генерирует хэш пароля.
        /// </summary>
        /// <param name="password">Пароль для хэширования.</param>
        /// <returns>Хэш пароля в виде строки (<see cref="string"/>).</returns>
        public string Generate(string password) => BCrypt.Net.BCrypt.EnhancedHashPassword(password);

        /// <summary>
        /// Проверяет соответствие пароля и хэша.
        /// </summary>
        /// <param name="password">Пароль для проверки.</param>
        /// <param name="hashedPassword">Хэш пароля.</param>
        /// <returns><see langword="true"/>, если пароль соответствует хэшу, иначе <see langword="false"/>.</returns>
        public bool Verify(string password, string hashedPassword) => BCrypt.Net.BCrypt.EnhancedVerify(password, hashedPassword);
    }
}