namespace SeriesTracker.API.Contracts
{
    public record SeriesRequest
    (
        int AnimeId,
        int WatchedEpisode,
        string? AddedDate,
        string? ChangedDate,
        int CategoryId,
        bool IsFavorite
    );
}