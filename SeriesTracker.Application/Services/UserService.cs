using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;

        public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
        }

        public async Task Register(string email, string password, string username, string avatar, string name, string surname, string dateBirth)
        {
            if (string.IsNullOrEmpty(username)) throw new ArgumentException("Username is required.");
            if (string.IsNullOrEmpty(email)) throw new ArgumentException("Email is required.");
            if (string.IsNullOrEmpty(password)) throw new ArgumentException("Password is required.");

            var hashedPassword = _passwordHasher.Generate(password);
            var user = User.Create(Guid.NewGuid(), username, name, surname, email, hashedPassword, avatar, dateBirth, DateTime.Now.ToString("s"));
            await _userRepository.CreateUser(user);
        }
        public string HashPassword(string password)
        {
            var hashedPassword = _passwordHasher.Generate(password);
            return hashedPassword;
        }

        public async Task<string> Login(string email, string password)
        {
            var user = await _userRepository.GetUserByEmail(email);
            var result = _passwordHasher.Verify(password, user.PasswordHash);

            if (result == false)
            {
                throw new Exception("Failed ot Login");
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

        public async Task<Guid> CreateUser(User user)
        {
            return await _userRepository.CreateUser(user);
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