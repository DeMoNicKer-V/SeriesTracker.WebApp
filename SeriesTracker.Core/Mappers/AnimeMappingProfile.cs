
using AutoMapper;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Models.Shikimori;


namespace SeriesTracker.Core.Mappers
{
    public class AnimeMappingProfile : Profile

    {
        public AnimeMappingProfile()
        {
            CreateMap<ShikimoriAnimeBase, AnimeShortDto>();
            CreateMap<ShikimoriAnimeBase, AnimeFullDto>();

            CreateMap<ShikimoriAnimeBase, AnimeSeriesDto>()
           .AfterMap((src, dest, context) => {
               dest.CategoryId = (int)context.Items["CategoryId"];
               dest.CategoryName = (string)context.Items["CategoryName"];
               dest.CategoryColor = (string)context.Items["CategoryColor"];
           });
        }
    }
}
