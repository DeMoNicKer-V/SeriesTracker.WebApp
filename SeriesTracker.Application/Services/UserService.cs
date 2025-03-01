using Microsoft.Extensions.Logging;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;
using System.Globalization;

namespace SeriesTracker.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;
        private readonly ILogger<UserService> _logger; // Внедряем ILogger<UserService>

        public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
            _logger = logger;
        }

        public async Task Register(string email, string password, string username, string avatar, string name, string surname, string dateBirth)
        {
            // 1. Валидация данных
            if (string.IsNullOrWhiteSpace(username)) // Используем IsNullOrWhiteSpace
            {
                _logger.LogWarning("Попытка регистрации с пустым username.");
                throw new ArgumentException("Никнейм не может быть пустым.", nameof(username)); // nameof() для лучшей информации об ошибке
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
                    username,
                    name,
                    surname,
                    email,
                    hashedPassword,
                    avatar,
                    dateBirth,
                    DateTime.UtcNow.ToString("s") // Используем UTC время
                );

                // 4. Сохранение пользователя в репозитории
                await _userRepository.CreateUser(user);
                _logger.LogInformation($"Пользователь {username} зарегистрирован успешно.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Ошибка при создании или сохранении пользователя {username}."); // Логируем все исключения
                                                                                                      //  Можно перебросить исключение, если нужно, чтобы оно обработалось в контроллере
                throw; //  или  throw new Exception("Не удалось зарегистрировать пользователя.", ex);
            }
        }

        public string HashPassword(string password)
        {
            var hashedPassword = _passwordHasher.Generate(password);
            return hashedPassword;
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

        public async Task<ICollection<Permission>> GetUserPermissions(Guid id)
        {
            return await _userRepository.GetUserPermissions(id);
        }

        public async Task<ICollection<Role>> GetUserRoles(Guid id)
        {
            return await _userRepository.GetUserRoles(id);
        }

        public async Task<Guid> DeleteUser(Guid id)
        {
            return await _userRepository.DeleteUser(id);
        }

        public async Task<List<User>> GetUserList()
        {
            return await _userRepository.GetUserList();
        }

        public async Task<User> GetUserById(Guid id)
        {
            return await _userRepository.GetUserById(id);
        }

        public async Task<User> GetUserByUserName(string username)
        {
            return await _userRepository.GetUserByUserName(username);
        }

        public async Task<Guid?> GetUserIdByEmail(string email)
        {
            return await _userRepository.GetUserIdByEmail(email);
        }

        public async Task<Guid?> GetUserIdByUserName(string userName)
        {
            return await _userRepository.GetUserIdByUserName(userName);
        }

        public async Task<Guid> UpdateUser(Guid id, string username, string name, string surname, string email, string passwordHash, string avatar, string dateBirth)
        {
            return await _userRepository.UpdateUser(id, username, name, surname, email, passwordHash, avatar, dateBirth);
        }

        public async Task<Guid> ChangeUserRole(Guid id, int roleId)
        {
            return await _userRepository.ChangeUserRole(id, roleId);
        }
    }
}