using SeriesTracker.Core.Interfaces;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Реализует интерфейс <see cref="IShikimoriAnimeFull"/>
    /// Наследуется от <see cref="ShikimoriAnime"/>, чтобы унаследовать общие свойства.
    /// </summary>
    public class ShikimoriAnimeFull : ShikimoriAnime, IShikimoriAnimeFull
    {
        /// <summary>
        /// Массив жанров аниме.
        /// </summary>
        public Genre[]? Genres { get; set; }

        /// <summary>
        /// Массив связанных аниме.
        /// </summary>
        public Related[]? Relateds { get; set; }

        /// <summary>
        /// Массив скриншотов из аниме.
        /// </summary>
        public Screenshot[]? Screenshots { get; set; }
    }
}