using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Abstractions.UserRoleAbstractions;
using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Application.Services
{
    public class UserRoleService : IUserRoleService
    {
        private readonly IUserRoleRepository _userRoleRepository;

        public UserRoleService(IUserRoleRepository userRoleRepository)
        {
            _userRoleRepository = userRoleRepository;
        }

        public async Task<int> CreateUserRole(UserRole userROle)
        {
            return await _userRoleRepository.CreateUserRole(userROle);
        }

        public async Task<int> DeleteUserRole(int id)
        {
            return await _userRoleRepository.DeleteUserRole(id);
        }

        public async Task<UserRole> GetUserRoleById(int id)
        {
            return await _userRoleRepository.GetUserRoleById(id);
        }

        public async Task<List<UserRole>> GetUserRoleList()
        {
            return await _userRoleRepository.GetUserRoleList();
        }
        public async Task<int> UpdateUserRole(int id, int accessLevelId, string name)
        {
            return await _userRoleRepository.UpdateUserRole(id, accessLevelId, name);
        }
    }
}
