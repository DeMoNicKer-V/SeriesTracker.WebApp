using SeriesTracker.Core.Models.Shikimori;
using System.Collections.ObjectModel;

namespace SeriesTracker.Core
{
    public static class ShikimoriAnimeConverter
    {
        private static readonly ReadOnlyCollection<string> _sourceArray = new(["MUSIC", "PV", "CM"]);

        public static ShikimoriAnimeBase ConvertFromDto(ShikimoriAnimeDto dto)
        {
            return new ShikimoriAnimeBase
            {
                Id = dto.Id,
                Title = dto.Title,
                SubTitle = dto.SubTitle,
                Genres = ConvertGenres(dto.Genre),
                Episodes = ConvertEpisodes(dto.Episodes, dto.EpisodesAired),
                StartDate = dto.StartDate ?? "Неизвестно",
                Description = ConvertDescription(dto.Description),
                Rating = ConvertRating(dto.Rating),
                Duration = dto.Duration,
                Score = dto.Score,
                Kind = ConvertKind(dto.Kind),
                Status = ConvertStatus(dto.Status),
                PictureUrl = dto.PictureUrl,
            };
        }

        public static ShikimoriAnimeBaseFull ConvertFromDtoFull(ShikimoriAnimeFullDto dto)
        {
            return new ShikimoriAnimeBaseFull
            {
                Relateds = GetRelateds(dto.Relatedes),
                Screenshots = dto.Screenshots,
            };
        }

        private static string ConvertGenres(Genre[]? genres)
        {
            return genres != null ? string.Join(", ", genres.Select(l => l.Russian)) : "";
        }

        private static int ConvertEpisodes(int episodes, int episodesAired)
        {
            return episodes == 0 ? episodesAired : episodes;
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

        private static IEnumerable<Related>? GetRelateds(Related[]? relatedData)
        {
            if (relatedData == null) return null;

            return relatedData.Where(a => a.Anime != null && !_sourceArray.Any(c => a.Anime.Kind?.Contains(c) == true));
        }

        // НОВЫЙ метод для преобразования списка DTO в список ShikimoriAnimeBase
        public static ShikimoriAnimeBase[] ConvertListFromDto(ShikimoriAnimeDto[] dtos)
        {
            return dtos.Select(ConvertFromDto).ToArray(); // Используем LINQ для преобразования каждого элемента
        }

        // НОВЫЙ метод для преобразования списка DTO в список ShikimoriAnimeBase
        public static ShikimoriAnimeBase[] ConvertListFromDtoFull(ShikimoriAnimeFullDto[] dtos)
        {
            return dtos.Select(ConvertFromDto).ToArray(); // Используем LINQ для преобразования каждого элемента
        }
    }
}