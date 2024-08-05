using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.API.Contracts
{
    public record SeriesResponse
    (
       Guid Id, int AnimeId, int WatchedEpisode, string AddedDate, string ChangedDate, int CategoryId, bool IsFavorite
    );

    public record SeriesAnimeResponse
(
   Guid Id, int AnimeId, int WatchedEpisode, string AddedDate, string ChangedDate, int CategoryId, bool IsFavorite, string Description, int Episodes, string StartDate, double Score, string Title, string SubTitle, string PictureUrl, string Rating, string Kind, string Status
);
}