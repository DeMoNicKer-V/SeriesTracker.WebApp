namespace SeriesTracker.Core.Interfaces
{
    public interface IAnime
    {
        int Id { get; set; }
        string? SubTitle { get; set; }
        string? Title { get; set; }
        int Episodes { get; set; }
        int EpisodesAired { get; set; }
        string? PictureUrl { get; } // Только геттер, т.к. вычисляется
        string? StartDate { get; } // Только геттер, т.к. вычисляется
    }
}
