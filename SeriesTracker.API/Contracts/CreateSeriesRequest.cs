namespace SeriesTracker.API.Contracts
{
    public record CreateSeriesRequest
    (
        int AnimeId,
        int CategoryId,
        int WatchedEpisode,
        string? AddedDate,
        string? ChangedDate,
        bool IsFavorite
        );
}