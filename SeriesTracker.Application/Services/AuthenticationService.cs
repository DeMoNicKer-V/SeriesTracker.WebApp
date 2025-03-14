using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        private readonly ILogger<AuthenticationService> _logger;

        public AuthenticationService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider, ILogger<AuthenticationService> logger)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
            _logger = logger;
        }

        public async Task<string> Login(string email, string password)
        {
            var user = await _userRepository.GetUserByEmail(email);

            // Объединяем проверки email и пароля в одно условие и одно сообщение об ошибке
            if (user == null || !_passwordHasher.Verify(password, user.PasswordHash))
            {
                // Логируем попытку входа с неверными данными (без указания конкретной причины)
                _logger.LogInformation($"Неудачная попытка входа: {email}");  // Используем LogInformation для логирования события
                throw new ArgumentException("Неправильный адрес почты или пароль");
            }

            var token = _jwtProvider.GenerateToken(user);
            return token;
        }

        public async Task<bool> Verify(string email, string password)
        {
            var user = await _userRepository.GetUserByEmail(email);
            var result = _passwordHasher.Verify(password, user.PasswordHash);

            if (result == false)
            {
                throw new Exception("Failed ot Login");
            }

            return result;
        }

        public async Task Register(string email, string password, string userName, string avatar, string name, string surName, string dateBirth)
        {
            // 1. Валидация данных
            if (string.IsNullOrWhiteSpace(userName)) // Используем IsNullOrWhiteSpace
            {
                _logger.LogWarning("Попытка регистрации с пустым userName.");
                throw new ArgumentException("Никнейм не может быть пустым.", nameof(userName)); // nameof() для лучшей информации об ошибке
            }
            if (string.IsNullOrWhiteSpace(email))
            {
                _logger.LogWarning("Попытка регистрации с пустым email.");
                throw new ArgumentException("Эл. почта не может быть пустым.", nameof(email));
            }
            if (string.IsNullOrWhiteSpace(password))
            {
                _logger.LogWarning("Попытка регистрации с пустым password.");
                throw new ArgumentException("Пароль не может быть пустым.", nameof(password));
            }

            // 2. Хеширование пароля
            string hashedPassword = _passwordHasher.Generate(password);

            // 3. Создание пользователя (с учетом безопасности и лучших практик)
            try
            {

                var user = User.Create(
                    Guid.NewGuid(),
                    userName,
                    name,
                    surName,
                    email,
                    hashedPassword,
                    avatar,
                    dateBirth,
                    DateTime.UtcNow.ToString("s") // Используем UTC время
                );

                // 4. Сохранение пользователя в репозитории
                await _userRepository.CreateUser(user);
                _logger.LogInformation($"Пользователь {userName} зарегистрирован успешно.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Ошибка при создании или сохранении пользователя {userName}."); // Логируем все исключения
                                                                                                      //  Можно перебросить исключение, если нужно, чтобы оно обработалось в контроллере
                throw; //  или  throw new Exception("Не удалось зарегистрировать пользователя.", ex);
            }
        }

        public async Task Logout(HttpContext context)
        {
            try
            {
                context.Response.Cookies.Delete("secretCookie"); // Удаляем cookie
                _logger.LogInformation("Пользователь успешно вышел из системы.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при выходе из системы.");
                throw; //  Перебрасываем исключение, чтобы обработать его в контроллере
            }
        }
    }
}
