using SeriesTracker.Core.Dtos.UserDtos;

namespace SeriesTracker.Core.Abstractions
{
    public interface IUserService
    {
        Task<bool> UpdateUser(Guid id, string? userName, string? name, string? surName, string? email, string? password, string? avatar, string? dateBirth);

        Task<bool> DeleteUser(Guid id);

        Task<(List<UserDto>, int)> GetUserList(int page);

        Task<UserDetailDto?> GetUserById(Guid id);

        Task<UserDetailDto?> GetUserByUserName(string userName);

        Task<bool> ChangeUserRole(Guid id, int roleId);

        Task<string> GenerateNewUserToken(string userName);
    }
}