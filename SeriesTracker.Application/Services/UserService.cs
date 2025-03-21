using Microsoft.Extensions.Logging;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Dtos.UserDtos;
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
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
            _logger = logger;
        }

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

        public async Task<(List<UserDto>, int)> GetUserList(int page)
        {
            return await _userRepository.GetUserList(page);
        }

        public async Task<User?> GetUserById(Guid id)
        {
            return await _userRepository.GetUserById(id);
        }

        public async Task<User?> GetUserByUserName(string userName)
        {
            return await _userRepository.GetUserByUserName(userName);
        }

        public async Task<Guid?> GetUserIdByEmail(string email)
        {
            return await _userRepository.GetUserIdByEmail(email);
        }

        public async Task<Guid?> GetUserIdByUserName(string userName)
        {
            return await _userRepository.GetUserIdByUserName(userName);
        }

        public async Task<Guid> UpdateUser(Guid id, string userName, string name, string surName, string email, string passwordHash, string avatar, string dateBirth)
        {
            return await _userRepository.UpdateUser(id, userName, name, surName, email, passwordHash, avatar, dateBirth);
        }

        public async Task<bool> ChangeUserRole(Guid id, int roleId)
        {
            return await _userRepository.ChangeUserRole(id, roleId);
        }
    }
}