namespace SeriesTracker.API.Contracts
{
    public record LastActivityResponse
    (
        int Id,
        string Image,
        string Title,
        string Date
     );
}