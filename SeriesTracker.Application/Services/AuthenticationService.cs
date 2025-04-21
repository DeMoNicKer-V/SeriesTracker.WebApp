using Microsoft.Extensions.Logging;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    /// <summary>
    /// Сервис для выполнения операций аутентификации, таких как вход, регистрация, проверка email и userName.
    /// </summary>
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IJwtProvider _jwtProvider;
        private readonly ILogger<AuthenticationService> _logger;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IUserRepository _userRepository;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="AuthenticationService"/>.
        /// </summary>
        /// <param name="userRepository">Репозиторий для работы с пользователями.</param>
        /// <param name="passwordHasher">Сервис для хеширования паролей.</param>
        /// <param name="jwtProvider">Провайдер для генерации JWT-токенов.</param>
        /// <param name="logger">Логгер для записи информации о работе сервиса.</param>
        public AuthenticationService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider, ILogger<AuthenticationService> logger)
        {
            // Внедряем зависимости (Dependency Injection) и проверяем на null
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));

            _passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));

            _jwtProvider = jwtProvider ?? throw new ArgumentNullException(nameof(jwtProvider));

            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<bool> EmailExists(string email)
        {
            // Получаем пользователя из репозитория по email
            var user = await _userRepository.GetUserByEmail(email);

            // Возвращаем true, если email занят, и false, если свободен
            return user != null;
        }

        public async Task<string> Login(string email, string password)
        {
            // 1. Получаем пользователя из репозитория по email
            var user = await _userRepository.GetUserByEmail(email);

            // 2. Проверяем, существует ли пользователь и совпадает ли пароль
            if (user == null || !_passwordHasher.Verify(password, user.PasswordHash))
            {
                // Если пользователь не найден или пароль не совпадает, возвращаем пустую строку
                return string.Empty;
            }

            // 3. Генерируем JWT-токен для пользователя
            var token = _jwtProvider.GenerateToken(user);

            return token;
        }

        public async Task Register(string userName, string email, string password, string? avatar, string? name, string? surName, string? dateBirth)
        {
            // 1. Хеширование пароля
            string hashedPassword = _passwordHasher.Generate(password);

            // 2. Создание пользователя
            var user = User.Create(
                Guid.NewGuid(), // Генерируем уникальный идентификатор для пользователя
                userName,
                email,
                hashedPassword,
                name,
                surName,
                avatar,
                dateBirth,
                DateTime.UtcNow.ToString("s") // Дата создания пользователя в формате ISO 8601
            );

            // 3. Сохранение пользователя в репозитории
            await _userRepository.CreateUser(user);
        }

        public async Task<bool> UserNameExists(string userName)
        {
            // Получаем пользователя из репозитория по userName
            var user = await _userRepository.GetUserByUserName(userName);

            // Возвращаем true, если userName занят, и false, если свободен
            return user != null;
        }

        public async Task<bool> Verify(string email, string password)
        {
            // 1. Получение пользователя из репозитория
            var user = await _userRepository.GetUserByEmail(email);

            // 2. Проверка существования пользователя
            if (user == null)
            {
                // Если пользователь не найден, логируем предупреждение и выбрасываем исключение
                _logger.LogWarning("Attempt to login with non-existent email: {email}", email);
                throw new UnauthorizedAccessException("Неверный email или пароль.");
            }

            // 3. Проверка пароля (хешированный пароль)
            bool passwordMatches = _passwordHasher.Verify(password, user.PasswordHash); // Проверяем пароль

            if (!passwordMatches)
            {
                // Если пароль не совпадает, выбрасываем исключение
                throw new UnauthorizedAccessException("Неверный email или пароль."); // Сообщаем о неверном email или пароле
            }

            // 4. Успешная аутентификация
            return true;
        }
    }
}