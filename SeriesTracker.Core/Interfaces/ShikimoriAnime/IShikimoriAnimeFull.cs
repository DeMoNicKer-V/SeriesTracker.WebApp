using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Interfaces
{
    public interface IShikimoriAnimeFull : IShikimoriAnime
    {
        Genre[]? Genres { get; set; }
        Screenshot[]? Screenshots { get; set; }
        Related[]? Relateds { get; set; }
    }
}
