namespace SeriesTracker.API.Contracts
{
    public record CreateSeriesRequest
    (
        int AnimeId,
        int CategoryId,
        int WatchedEpisode,
        bool IsFavorite
        );
}