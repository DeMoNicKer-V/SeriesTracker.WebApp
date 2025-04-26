using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    // Представляет полные данные аниме, включая информацию о категориях и пользовательских настройках.
    // Наследуется от ShikimoriAnimeFull и реализует интерфейс IAnimeSeries.
    public class AnimeSeriesFullDto : ShikimoriAnimeFull, IAnimeSeries
    {
        // Уникальный идентификатор элемента списка пользователя.
        public Guid? SeriesId { get; set; }

        // Идентификатор категории, к которой относится аниме.
        public int CategoryId { get; set; }

        // Название категории, к которой относится аниме.
        public string CategoryName { get; set; }

        // Цвет категории, к которой относится аниме.
        public string CategoryColor { get; set; }

        // Количество просмотренных эпизодов аниме-сериала пользователем.
        public int WatchedEpisodes { get; set; }

        // Дата добавления аниме.
        public string AddedDate { get; set; }

        // Дата последнего изменения пользовательских настроек аниме.
        public string ChangedDate { get; set; }

        // Флаг, указывающий, добавлено ли аниме в избранное пользователем.
        public bool IsFavorite { get; set; }
    }
}