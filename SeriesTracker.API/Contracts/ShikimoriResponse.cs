namespace SeriesTracker.API.Contracts
{
    public record ShikimoriResponse(int MalId, string Title, string Description, int Episodes, double Score, string Image);
}
