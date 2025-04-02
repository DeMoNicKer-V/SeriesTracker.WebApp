namespace SeriesTracker.API.Contracts
{
    public record UserSeriesRequest
    (
        int MyList = 0,
        bool IsFavorite = false
    );
}