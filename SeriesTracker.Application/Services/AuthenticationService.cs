using Microsoft.Extensions.Logging;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Application.Services;
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
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("Email не может быть пустым или пробелом.", nameof(email));
            }

            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Пароль не может быть пустым или пробелом.", nameof(password));
            }

            var user = await _userRepository.GetUserByEmail(email);

            if (user == null)
            {
                _logger.LogWarning("Попытка входа с несуществующим email: {email}", email);
                throw new UnauthorizedAccessException("Неверный email или пароль.");
            }

            bool passwordMatches = _passwordHasher.Verify(password, user.PasswordHash);

            if (!passwordMatches)
            {
                _logger.LogWarning("Неудачная попытка входа для пользователя: {Email}", email);
                throw new UnauthorizedAccessException("Неверный email или пароль.");
            }

            return true;
        }

        public async Task<bool> EmailExists(string email)
        {
            var user = await _userRepository.GetUserByEmail(email);

            return user != null; // Возвращаем true, если email занят, и false, если свободен
        }

        public async Task<bool> UserNameExists(string userName)
        {
            var user = await _userRepository.GetUserByUserName(userName);

            return user != null; // Возвращаем true, если userName занят, и false, если свободен
        }

        public async Task Register(string email, string password, string userName, string? avatar, string? name, string? surName, string? dateBirth)
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

            // 3. Создание пользователя
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
                _logger.LogError(ex, $"Ошибка при создании или сохранении пользователя {userName}.");

                throw new Exception("Не удалось зарегистрировать пользователя.", ex);
            }
        }
    }
}