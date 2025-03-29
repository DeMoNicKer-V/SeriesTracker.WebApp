namespace SeriesTracker.API.Contracts
{
    public record UserSeriesRequest
    (
        int Page = 1,
        int MyList = 0,
        bool IsFavorite = false
    );
}