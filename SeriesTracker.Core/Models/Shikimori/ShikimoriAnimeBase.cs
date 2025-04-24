using SeriesTracker.Core.Interfaces;

namespace SeriesTracker.Core.Models.Shikimori
{
    public partial class ShikimoriAnimeBase : AnimeBase, IShikimoriAnime
    {
        public double Score { get; set; }
        public string? Description { get; set; }
        public int Duration { get; set; }
        public string? Kind { get; set; }
        public string? Status { get; set; }
        public string? Rating { get; set; }
    }
}