using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    // Представляет базовые данные аниме, включая информацию о категориях.
    // Наследуется от ShikimoriAnime и реализует интерфейс IAnimeSeries.
    public class AnimeSeriesDto : ShikimoriAnime, IAnimeSeries
    {
        // Идентификатор категории, к которой относится аниме.
        public int CategoryId { get; set; }

        // Название категории, к которой относится аниме.
        public string CategoryName { get; set; }

        // Цвет категории, к которой относится аниме.
        public string CategoryColor { get; set; }
    }
}