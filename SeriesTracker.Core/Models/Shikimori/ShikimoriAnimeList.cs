using SeriesTracker.Core.Interfaces;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Обобщенный класс для представления списка аниме.
    /// <see cref="T"/> должен реализовывать интерфейс <see cref="IAnime"/>, чтобы гарантировать, что все элементы списка являются аниме.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ShikimoriAnimeList<T> where T : IAnime
    {
        /// <summary>
        /// Массив аниме типа T.
        /// </summary>
        public T[] Animes { get; set; } = [];
    }
}