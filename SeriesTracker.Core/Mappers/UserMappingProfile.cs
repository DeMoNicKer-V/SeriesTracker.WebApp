using AutoMapper;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Dtos.User;
using SeriesTracker.Core.Dtos.UserDtos;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Mappers
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<User, UserDto>();

            CreateMap<User, UserDetailDto>();

            CreateMap<User, UserActivityDTO>().AfterMap((src, dest, context) =>
            {
                dest.SeriesGroup = (List<SeriesGroupDto>)context.Items["SeriesGroup"];
                dest.SeriesIDS = (string)context.Items["SeriesIDS"];
            });
        }
    }
}