using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// Представляет базовые данные аниме, включая информацию о категориях.
    /// Наследуется от ShikimoriAnime и реализует интерфейс IAnimeSeries.
    /// </summary>
    public class AnimeSeriesDto : ShikimoriAnime, IAnimeSeries
    {
        /// <summary>
        /// Идентификатор категории, к которой относится аниме.
        /// </summary>
        public int CategoryId { get; set; }

        /// <summary>
        /// Название категории, к которой относится аниме.
        /// </summary>
        public required string CategoryName { get; set; }

        /// <summary>
        /// Цвет категории, к которой относится аниме.
        /// </summary>
        public required string CategoryColor { get; set; }
    }
}