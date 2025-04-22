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

            CreateMap<ShikimoriAnimeBase, AnimeSeriesDto>()
                .BeforeMap((src, dest, context) =>
                {
                    if (context.Items.Count == 0)
                    {
                        return;
                    }
                    dest.CategoryId = (int)context.Items["CategoryId"];
                    dest.CategoryName = (string)context.Items["CategoryName"];
                    dest.CategoryColor = (string)context.Items["CategoryColor"];
                });

            CreateMap<ShikimoriAnimeBase, AnimeSeriesFullDto>()
              .BeforeMap((src, dest, context) =>
              {
                  if (context.Items.Count == 0)
                  {
                      return;
                  }
                  dest.SeriesId = (Guid)context.Items["SeriesId"];
                  dest.CategoryId = (int)context.Items["CategoryId"];
                  dest.CategoryName = (string)context.Items["CategoryName"];
                  dest.CategoryColor = (string)context.Items["CategoryColor"];
                  dest.WatchedEpisodes = (int)context.Items["WatchedEpisodes"];
                  dest.AddedDate = (string)context.Items["AddedDate"];
                  dest.ChangedDate = (string)context.Items["ChangedDate"];
                  dest.IsFavorite = (bool)context.Items["IsFavorite"];
              });
        }
    }
}