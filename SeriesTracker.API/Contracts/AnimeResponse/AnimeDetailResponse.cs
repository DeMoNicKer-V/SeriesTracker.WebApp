namespace SeriesTracker.API.Contracts.AnimeResponse
{
    public record AnimeDetailResponse
    (
        string Kind,
        string Rating,
        string Status,
        string StartDate,
        int Episodes,
        int Duration,
        double Scrore
        );
}
