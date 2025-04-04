using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Dtos.User;
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
                UserName = user.UserName,
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
                UserName = user.UserName,
                Email = user.Email,
                RoleId = user.RoleId,
                RegDate = user.RegDate,
                Name = user.Name,
                SurName = user.SurName,
                DateBirth = user.DateBirth,
                Avatar = user.Avatar,
            };
        }

        public static UserActivityDTO ToUserActivityDto(this User user, List<SeriesGroupDto> series, string seriesIDS)
        {
            return new UserActivityDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                RoleId = user.RoleId,
                RegDate = user.RegDate,
                Name = user.Name,
                SurName = user.SurName,
                DateBirth = user.DateBirth,
                Avatar = user.Avatar,
                SeriesGroup = series,
                SeriesIDS = seriesIDS
            };
        }
    }
}