using SeriesTracker.Core.Interfaces;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class AnimeBase : IAnime
    {
        public int Id {  get; set; }
        public string? SubTitle { get; set; }
        public string? Title { get; set; }
        public int Episodes { get; set; }
        public int EpisodesAired { get; set; }
        public string? PictureUrl { get; set; }
        public string? StartDate { get; set; }
    }
}