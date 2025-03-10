using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions.UserAbastractions
{
    public interface IUserService
    {
        Task Register(string email, string password, string nickname, string avatar, string name, string surName, string dateBirth);
        Task<string> Login(string email, string password);
        Task<bool> Verify(string email, string password);
        string HashPassword(string password);
        Task<Guid> DeleteUser(Guid id);
        Task<List<User>> GetUserList();
        Task<User> GetUserById(Guid id);
        Task<Guid?> GetUserIdByEmail(string email);
        Task<Guid?> GetUserIdByUserName(string userName);
        Task<ICollection<Permission>> GetUserPermissions(Guid id);
        Task<ICollection<Role>> GetUserRoles(Guid userId);
        Task<User> GetUserByUserName(string userName);
        Task<Guid> UpdateUser(Guid id, string userName, string name, string surName, string email, string passwordHash, string avatar, string dateBirth);
        Task<Guid> ChangeUserRole(Guid id, int roleId);
        Task<string> GenerateNewUserToken(string userName);
    }
}
