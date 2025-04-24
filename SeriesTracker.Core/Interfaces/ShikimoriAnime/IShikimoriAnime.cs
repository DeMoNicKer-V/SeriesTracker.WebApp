namespace SeriesTracker.Core.Interfaces
{
    public interface IShikimoriAnime : IAnime
    {
        double Score { get; set; }
        string? Description { get; set; }
        int Duration { get; set; }
        string? Kind { get; set; }
        string? Status { get; set; }
        string? Rating { get; set; }
    }
}
