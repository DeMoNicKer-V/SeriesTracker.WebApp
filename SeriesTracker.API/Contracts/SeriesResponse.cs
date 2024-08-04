using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.API.Contracts
{
    public record SeriesResponse
    (
       Guid Id, int AnimeId, int WatchedEpisode, string AddedDate, string ChangedDate, Guid CategoryId, bool IsFavorite
    );
}