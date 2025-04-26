using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// DTO, представляющий сгруппированные жанры аниме по категориям.
    /// </summary>
    public class GenreGroupingDTO
    {
        /// <summary>
        /// Список жанров, относящихся к тематике аниме.
        /// </summary>
        public List<Genre> Theme { get; set; } = [];

        /// <summary>
        /// Список основных жанров аниме.
        /// </summary>
        public List<Genre> Genre { get; set; } = [];

        /// <summary>
        /// Список жанров, определяющих целевую аудиторию аниме.
        /// </summary>
        public List<Genre> Demographic { get; set; } = [];
    }
}