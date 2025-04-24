using AutoMapper;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Models.Shikimori;
using System.Collections.ObjectModel;

namespace SeriesTracker.Core.Mappers
{
    public class AnimeMappingProfile : Profile

    {
        private static readonly ReadOnlyCollection<string> _sourceArray = new(["MUSIC", "PV", "CM"]);

        public AnimeMappingProfile()
        {
            CreateMap<ShikimoriAnimeDto, ShikimoriAnimeBase>()
                               .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate ?? "Неизвестно"))
                               .ForMember(dest => dest.Description, opt => opt.MapFrom(src => ConvertDescription(src.Description)))
                               .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => ConvertRating(src.Rating)))
                               .ForMember(dest => dest.Kind, opt => opt.MapFrom(src => ConvertKind(src.Kind)))
                               .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ConvertStatus(src.Status)));

            CreateMap<ShikimoriAnimeFullDto, ShikimoriAnimeBaseFull>()
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate ?? "Неизвестно"))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => ConvertDescription(src.Description)))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => ConvertRating(src.Rating)))
                .ForMember(dest => dest.Kind, opt => opt.MapFrom(src => ConvertKind(src.Kind)))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ConvertStatus(src.Status)))
                .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres))
                .ForMember(dest => dest.Relateds, opt => opt.MapFrom(src => GetRelateds(src.Relateds)));

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

            CreateMap<ShikimoriAnimeBaseFull, AnimeSeriesFullDto>()
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

        private static string? ConvertDescription(string? descriptionInfo)
        {
            return string.IsNullOrEmpty(descriptionInfo) ? null : AnimeConverter.ConvertDescriptionWithRegex(descriptionInfo);
        }

        private static string ConvertRating(string? ratingInfo)
        {
            return AnimeConverter.ConvertRatingToImageName(ratingInfo);
        }

        private static string ConvertKind(string? kindInfo)
        {
            return AnimeConverter.ConvertKindToRussian(kindInfo);
        }

        private static string ConvertStatus(string? statusInfo)
        {
            return AnimeConverter.ConvertStatusToDefault(statusInfo);
        }

        private static Related[]? GetRelateds(Related[]? relatedData)
        {
            if (relatedData == null) return null;

            return relatedData.Where(a => a.Anime != null && !_sourceArray.Any(c => a.Anime.Kind?.Contains(c) == true)).ToArray();
        }
    }
}