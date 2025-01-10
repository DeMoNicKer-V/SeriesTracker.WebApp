using SeriesTracker.Core.Dtos.UserDtos;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Mappers
{
    public static class UserMapper
    {
        public static UserDto ToDTO(this User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                RoleId = user.RoleId,
                RegDate = user.RegDate,
            };
        }
        public static UserDetailDto ToDetailDTO(this User user)
        {
            return new UserDetailDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                RoleId = user.RoleId,
                RegDate = user.RegDate,
                Name = user.Name,
                Surname = user.Surname,
                DateBirth = user.DateBirth,
                Avatar = user.Avatar,
            };
        }
    }
}
