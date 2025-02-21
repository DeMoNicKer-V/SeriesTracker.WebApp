using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos.Anime
{
    public record AnimeFullDto
    (
         string? Description,
         int Episodes,
         int EpisodesAired,
         string Genres,
         int Id,
         string Kind,
         string? PictureUrl,
         string Rating,
         string StartDate,
         string Status,
         string? SubTitle,
         string? Title,
         double? Score,
         int? Duration,
         IEnumerable<Related>? Relateds,
         Screenshot[]? Screenshots
    );
}