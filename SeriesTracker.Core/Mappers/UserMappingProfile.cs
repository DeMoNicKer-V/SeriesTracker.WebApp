using AutoMapper;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Mappers
{
    /// <summary>
    /// Профиль AutoMapper для маппинга объектов User и связанных с ними DTOs.
    /// </summary>
    public class UserMappingProfile : Profile
    {
        /// <summary>
        /// Конструктор профиля, определяющий правила маппинга.
        /// </summary>
        public UserMappingProfile()
        {
            // Маппинг User в UserDto.
            // Этот маппинг преобразует основные данные пользователя в DTO для общего использования.
            CreateMap<User, UserDto>();

            // Маппинг User в UserDetailDto.
            // Этот маппинг преобразует детальную информацию о пользователе в DTO для отображения подробных данных.
            CreateMap<User, UserDetailDto>();

            // Маппинг User в UserActivityDTO с дополнительной логикой после маппинга.
            // Этот маппинг преобразует данные пользователя и добавляет информацию об активности пользователя.
            CreateMap<User, UserActivityDTO>().AfterMap((src, dest, context) =>
            {
                dest.SeriesGroup = (List<SeriesGroupFullDto>)context.Items["SeriesGroup"];
                dest.SeriesIDS = (string)context.Items["SeriesIDS"];
            });
        }
    }
}