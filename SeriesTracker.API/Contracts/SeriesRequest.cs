namespace SeriesTracker.API.Contracts
{
    public record SeriesRequest
    (
        int AnimeId,
        int WatchedEpisode,
        string? AddedDate,
        string? ChangedDate,
        Guid CategoryId,
        bool IsFavorite
    );
}