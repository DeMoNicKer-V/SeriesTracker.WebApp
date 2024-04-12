namespace SeriesTracker.API.Contracts
{
    public record SeriesRequest
    (
        string Title,
        string Description,
        int WatchedEpisode,
        int LastEpisode,
        int Duration,
        float Rating,
        string ReleaseDate,
        string AddedDate,
        string OverDate,
        string ChangedDate,
        bool IsOver,
        bool IsFavorite
    );
}