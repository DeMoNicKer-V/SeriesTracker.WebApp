using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions.UserAbastractions
{
    public interface IUserRepository
    {
        Task<Guid> CreateUser(User user);
        Task<Guid> DeleteUser(Guid id);
        Task<List<User>> GetUserList();
        Task<User> GetUserById(Guid id);
        Task<User> GetUserByEmail(string email);
        Task<Guid> UpdateUser(Guid id, int userRoleId, string userName, string name, string surName, string email, string password, string avatar, string dateBirth, string regDate);
    }
}
