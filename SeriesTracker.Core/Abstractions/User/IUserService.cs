using SeriesTracker.Core.Dtos.UserDtos;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions.UserAbastractions
{
    public interface IUserService
    {
        string HashPassword(string password);
        Task<Guid> DeleteUser(Guid id);
        Task<(List<UserDto>, int)> GetUserList(int page);
        Task<User?> GetUserById(Guid id);
        Task<User?> GetUserByUserName(string userName);
        Task<Guid?> GetUserIdByEmail(string email);
        Task<Guid?> GetUserIdByUserName(string userName);
        Task<ICollection<Permission>> GetUserPermissions(Guid id);
        Task<ICollection<Role>> GetUserRoles(Guid userId);
        Task<Guid> UpdateUser(Guid id, string userName, string name, string surName, string email, string passwordHash, string avatar, string dateBirth);
        Task<bool> ChangeUserRole(Guid id, int roleId);
        Task<string> GenerateNewUserToken(string userName);
    }
}
