using AutoMapper;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.UserDtos;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Application.Services
{
    /// <summary>
    /// Сервис для работы с пользователями.  Предоставляет методы для получения, создания, обновления и удаления пользователей.
    /// </summary>
    public class UserService : IUserService
    {
        private readonly IJwtProvider _jwtProvider;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IUserRepository _userRepository;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="UserService"/>.
        /// </summary>
        /// <param name="userRepository">Репозиторий для работы с пользователями.</param>
        /// <param name="passwordHasher">Сервис для хеширования паролей.</param>
        /// <param name="jwtProvider">Провайдер для генерации JWT-токенов.</param>
        /// <param name="mapper">AutoMapper для преобразования объектов.</param>
        public UserService(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            IJwtProvider jwtProvider,
            IMapper mapper)
        {
            // Внедряем зависимости (Dependency Injection) и проверяем на null
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));

            _passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));

            _jwtProvider = jwtProvider ?? throw new ArgumentNullException(nameof(jwtProvider));

            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<bool> ChangeUserRole(Guid id, int roleId)
        {
            // Изменяем роль пользователя в репозитории
            return await _userRepository.ChangeUserRole(id, roleId);
        }

        public async Task<bool> DeleteUser(Guid id)
        {
            // Удаляем пользователя из репозитория
            return await _userRepository.DeleteUser(id);
        }

        public async Task<string> GenerateNewUserToken(string userName)
        {
            // 1. Получаем пользователя из репозитория по имени пользователя
            User? user = await _userRepository.GetUserByUserName(userName);

            // 2. Проверяем, существует ли пользователь
            if (user == null)
            {
                // Если пользователь не найден, возвращаем пустую строку
                return string.Empty;
            }

            // 3. Генерируем JWT-токен для пользователя
            string token = _jwtProvider.GenerateToken(user);

            // 4. Возвращаем токен
            return token;
        }
        public async Task<UserDetailDto?> GetUserById(Guid id)
        {
            // 1. Получаем пользователя из репозитория по ID
            var user = await _userRepository.GetUserById(id);

            // 2. Преобразуем объект User в объект UserDetailDto с помощью AutoMapper
            return _mapper.Map<UserDetailDto>(user);
        }

        public async Task<UserDetailDto?> GetUserByUserName(string userName)
        {
            // 1. Получаем пользователя из репозитория по имени пользователя
            User? user = await _userRepository.GetUserByUserName(userName);

            // 2. Преобразуем объект User в объект UserDetailDto с помощью AutoMapper
            return _mapper.Map<UserDetailDto>(user);
        }

        public async Task<(List<UserDto>, int)> GetUserList(int page)
        {
            // Получаем список пользователей из репозитория
            return await _userRepository.GetUserList(page);
        }
        public async Task<bool> UpdateUser(Guid id, string? userName, string? name, string? surName, string? email, string? password, string? avatar, string? dateBirth)
        {
            // 1. Хешируем новый пароль, если он был указан
            string passwordHash = !string.IsNullOrEmpty(password) ? _passwordHasher.Generate(password) : string.Empty;

            // 2. Обновляем информацию о пользователе в репозитории
            return await _userRepository.UpdateUser(id, userName, name, surName, email, passwordHash, avatar, dateBirth);
        }
    }
}