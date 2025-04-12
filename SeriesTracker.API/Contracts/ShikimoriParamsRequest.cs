namespace SeriesTracker.API.Contracts
{
    public record ShikimoriParamsRequest
    (
        int Page = 1,
        string Name = "",
        string Season = "",
        string Status = "",
        string Kind = "",
        string Genre = "",
        string Order = "ranked",
        bool Censored = false
    );
}
