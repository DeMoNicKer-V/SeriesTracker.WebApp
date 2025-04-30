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
        public int CategoryId { get; set; }
        public required string CategoryName { get; set; }
        public required string CategoryColor { get; set; }
        public bool IsFavorite { get; set; }
    }
}