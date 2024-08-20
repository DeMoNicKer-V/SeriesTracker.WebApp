using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions.UserRoleAbstractions
{
    public interface IUserRoleService
    {
        Task<int> CreateUserRole(UserRole userRole);
        Task<int> DeleteUserRole(int id);
        Task<List<UserRole>> GetUserRoleList();
        Task<UserRole> GetUserRoleById(int id);
        Task<int> UpdateUserRole(int id, int accessLevelId, string name);
    }
}
