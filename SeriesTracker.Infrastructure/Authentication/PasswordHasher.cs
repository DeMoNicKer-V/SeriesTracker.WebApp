using SeriesTracker.Application.Interfaces.Auth;

namespace SeriesTracker.Infrastructure.Authentication
{
    /// <summary>
    /// Класс для хэширования паролей с использованием библиотеки BCrypt.Net.
    /// </summary>
    public class PasswordHasher : IPasswordHasher
    {
        public string Generate(string password) => BCrypt.Net.BCrypt.EnhancedHashPassword(password);

        public bool Verify(string password, string hashedPassword) => BCrypt.Net.BCrypt.EnhancedVerify(password, hashedPassword);
    }
}