using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Guid> CreateUser(User user)
        {
            return await _userRepository.CreateUser(user);
        }

        public async Task<Guid> DeleteUser(Guid id)
        {
            return await _userRepository.DeleteUser(id);
        }

        public async Task<User> GetUserById(Guid id)
        {
            return await _userRepository.GetUserById(id);
        }

        public async Task<List<User>> GetUserList()
        {
            return await _userRepository.GetUserList();
        }
        public async Task<Guid> UpdateUser(Guid id, int userRoleId, string userName, string name, string surName, string email, string password, string avatar, string dateBirth, string regDate)
        {
            return await _userRepository.UpdateUser(id, userRoleId, userName, name, surName, email, password, avatar, dateBirth, regDate);
        }
    }
}