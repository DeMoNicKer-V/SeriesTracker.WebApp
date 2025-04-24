using SeriesTracker.Core.Interfaces;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnimeBaseFull : ShikimoriAnimeBase, IShikimoriAnimeFull
    {
        public Genre[]? Genres { get; set; }
        public Screenshot[]? Screenshots { get; set; }
        public Related[]? Relateds { get; set; }
    }
}