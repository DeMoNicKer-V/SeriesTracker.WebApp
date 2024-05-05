namespace SeriesTracker.API.Contracts
{
    public record SeriesResponse
    (
       Guid Id, string Title, string Description, int WatchedEpisode, int LastEpisode, int Duration,
            float Rating, string ImagePath, string ReleaseDate, string AddedDate, string ChangedDate, string OverDate, bool IsOver, bool IsFavorite
    );
}
