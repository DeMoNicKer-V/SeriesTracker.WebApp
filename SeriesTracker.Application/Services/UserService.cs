using AutoMapper;
using Microsoft.Extensions.Logging;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.UserDtos;

namespace SeriesTracker.Application.Services
{
    public class UserService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider,
        ILogger<UserService> logger,
        IMapper mapper) : IUserService
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IJwtProvider _jwtProvider = jwtProvider;
        private readonly ILogger<UserService> _logger = logger;
        private readonly IMapper _mapper = mapper;

        public string HashPassword(string password)
        {
            var hashedPassword = _passwordHasher.Generate(password);
            return hashedPassword;
        }

        public async Task<string> GenerateNewUserToken(string userName)
        {
            var user = await _userRepository.GetUserByUserName(userName);

            if (user == null)
            {
                // Логируем попытку входа с неверными данными (без указания конкретной причины)
                _logger.LogInformation($"Ошибка при генерации токена для userName: {userName}");
                throw new ArgumentException("Пользователь не найден");
            }

            var token = _jwtProvider.GenerateToken(user);
            return token;
        }

        public async Task<bool> DeleteUser(Guid id)
        {
            return await _userRepository.DeleteUser(id);
        }

        public async Task<(List<UserDto>, int)> GetUserList(int page)
        {
            return await _userRepository.GetUserList(page);
        }

        public async Task<UserDetailDto?> GetUserById(Guid id)
        {
            var user = await _userRepository.GetUserById(id);
            return _mapper.Map<UserDetailDto>(user);
        }

        public async Task<UserDetailDto?> GetUserByUserName(string userName)
        {
            var user = await _userRepository.GetUserByUserName(userName);
            return _mapper.Map<UserDetailDto>(user);
        }

        public async Task<bool> UpdateUser(Guid id, string userName, string name, string surName, string email, string passwordHash, string avatar, string dateBirth)
        {
            return await _userRepository.UpdateUser(id, userName, name, surName, email, passwordHash, avatar, dateBirth);
        }

        public async Task<bool> ChangeUserRole(Guid id, int roleId)
        {
            return await _userRepository.ChangeUserRole(id, roleId);
        }
    }
}