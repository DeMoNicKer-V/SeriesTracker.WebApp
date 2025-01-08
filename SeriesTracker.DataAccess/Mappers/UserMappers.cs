
using SeriesTracker.DataAccess.Dtos.User;
using SeriesTracker.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.DataAccess.Mappers
{
    public static class UserMappers
    {
        public static UserDto ToUserShortDto(this UserEntity userModel)
        {
            return new UserDto
            {
                Id = userModel.Id,
                UserName = userModel.UserName,
                Email = userModel.Email,
                RegDate = userModel.RegDate,
                Roles = userModel.Roles,
            };
        }
    }
}
