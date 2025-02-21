using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions.UserAbastractions
{
    public interface IUserRepository
    {
        Task<Guid> CreateUser(User user);
        Task<Guid> DeleteUser(Guid id);
        Task<HashSet<Permission>> GetUserPermissions(Guid userId);
        Task<HashSet<Role>> GetUserRoles(Guid userId);
        Task<User> GetUserById(Guid id);
        Task<List<User>> GetUserList();
        Task<User> GetUserByEmail(string email);
        Task<Guid?> GetUserIdByEmail(string email);
        Task<Guid?> GetUserIdByUserName(string userName);
        Task<User> GetUserByUserName(string username);
        Task<Guid> UpdateUser(Guid id, string username, string name, string surname, string email, string passwordHash, string avatar, string dateBirth);
        Task<Guid> ChangeUserRole(Guid id, int roleId);
    }
}
