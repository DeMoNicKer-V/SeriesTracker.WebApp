using SeriesTracker.Core.Interfaces;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnimeBaseList<T> where T : IAnime
    {
        public T[] Animes { get; set; } = [];
    }
}