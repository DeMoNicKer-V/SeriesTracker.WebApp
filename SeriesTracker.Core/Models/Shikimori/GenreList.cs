namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Представляет список жанров аниме.
    /// </summary>
    public class GenreList
    {
        /// <summary>
        /// Массив объектов <see cref="Genre"/>, представляющих список жанров.
        /// </summary>
        public Genre[] Genres { get; set; } = [];
    }
}