using AutoMapper;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Mappers
{
    public class SeriesCategoryMappingProfile : Profile
    {
        public SeriesCategoryMappingProfile()
        {
            CreateMap<UserSeries, SeriesCategoryDto>().AfterMap((src, dest, context) =>
            {
                dest.CategoryId = (int)context.Items["CategoryId"];
                dest.CategoryName = (string)context.Items["CategoryName"];
                dest.CategoryColor = (string)context.Items["CategoryColor"];
            });
        }
    }
}