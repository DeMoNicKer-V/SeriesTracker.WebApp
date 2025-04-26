using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Interfaces
{
    /// <summary>
    /// Расширяет интерфейс <see cref="IShikimoriAnime"/>, добавляя новые свойства.
    /// </summary>
    public interface IShikimoriAnimeFull : IShikimoriAnime
    {
        /// <summary>
        /// Массив жанров аниме.
        /// </summary>
        Genre[]? Genres { get; set; }

        /// <summary>
        /// Массив связанных аниме.
        /// </summary>
        Related[]? Relateds { get; set; }

        /// <summary>
        /// Массив скриншотов из аниме.
        /// </summary>
        Screenshot[]? Screenshots { get; set; }
    }
}