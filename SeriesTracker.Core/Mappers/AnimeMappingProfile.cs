
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
        }
    }
}
