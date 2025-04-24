using AutoMapper;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;
using System.Collections.ObjectModel;

namespace SeriesTracker.Core.Mappers
{
    public class AnimeMappingProfile : Profile

    {
        private static readonly ReadOnlyCollection<string> _sourceArray = new(["MUSIC", "PV", "CM"]);

        public AnimeMappingProfile()
        {
            CreateMap<ShikimoriAnimeDto, ShikimoriAnimeBase>();
            CreateMap<ShikimoriAnimeFullDto, ShikimoriAnimeBaseFull>()
                .AfterMap((src, dest) =>
                {
                    dest.Description = ConvertDescription(src.Description);
                    dest.Rating = ConvertRating(src.Rating);
                    dest.Kind = ConvertKind(src.Kind);
                    dest.Status = ConvertStatus(src.Status);
                })
                .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres))
                .ForMember(dest => dest.Relateds, opt => opt.MapFrom(src => GetRelateds(src.Relateds)));

            CreateMap<ShikimoriAnimeBase, AnimeSeriesDto>()
              .BeforeMap((_, dest, context) => MapCategoryProperties(dest, context));

            CreateMap<ShikimoriAnimeBaseFull, AnimeSeriesFullDto>()
                .BeforeMap((_, dest, context) =>
                {
                    dest.SeriesId = (Guid)context.Items["SeriesId"];
                    dest.WatchedEpisodes = (int)context.Items["WatchedEpisodes"];
                    dest.ChangedDate = (string)context.Items["ChangedDate"];
                    dest.IsFavorite = (bool)context.Items["IsFavorite"];
                    MapCategoryProperties(dest, context); // Вызываем общий метод
                });
        }

        private void MapCategoryProperties(IAnimeSeries dest, ResolutionContext context)
        {
            if (dest is null || context is null || context.Items is null) return;

            if (context.Items.ContainsKey("CategoryId"))
                dest.CategoryId = (int)context.Items["CategoryId"];
            if (context.Items.ContainsKey("CategoryName"))
                dest.CategoryName = (string)context.Items["CategoryName"];
            if (context.Items.ContainsKey("CategoryColor"))
                dest.CategoryColor = (string)context.Items["CategoryColor"];
        }

        private static string? ConvertDescription(string? descriptionInfo)
        {
            return string.IsNullOrEmpty(descriptionInfo) ? null : AnimeConverter.ConvertDescriptionWithRegex(descriptionInfo);
        }

        private static string ConvertKind(string? kindInfo)
        {
            return AnimeConverter.ConvertKindToRussian(kindInfo);
        }

        private static string ConvertRating(string? ratingInfo)
        {
            return AnimeConverter.ConvertRatingToImageName(ratingInfo);
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