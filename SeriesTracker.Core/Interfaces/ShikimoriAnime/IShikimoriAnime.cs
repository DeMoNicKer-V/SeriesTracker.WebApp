namespace SeriesTracker.Core.Interfaces
{
    public interface IShikimoriAnime : IAnime
    {
        int Episodes { get; set; }
        int EpisodesAired { get; set; }
        double Score { get; set; }
        string? Description { get; set; }
        int Duration { get; set; }
        string? Status { get; set; }
        string? Rating { get; set; }
    }
}
