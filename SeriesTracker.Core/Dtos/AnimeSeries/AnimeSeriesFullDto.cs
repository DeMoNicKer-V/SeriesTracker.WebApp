using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// Представляет полные данные аниме, включая информацию о категориях и пользовательских настройках.
    /// Наследуется от <see cref="ShikimoriAnimeFull"/> и реализует интерфейс <see cref="IAnimeSeries"/>.
    /// </summary>
    public class AnimeSeriesFullDto : ShikimoriAnimeFull, IAnimeSeries
    {
        /// <summary>
        /// Уникальный идентификатор элемента списка пользователя.
        /// </summary>
        public Guid? SeriesId { get; set; }

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

        /// <summary>
        /// Количество просмотренных эпизодов аниме-сериала пользователем.
        /// </summary>
        public required int WatchedEpisodes { get; set; }

        /// <summary>
        /// Дата добавления аниме.
        /// </summary>
        public required string AddedDate { get; set; }

        /// <summary>
        /// Дата последнего изменения пользовательских настроек аниме.
        /// </summary>
        public required string ChangedDate { get; set; }

        /// <summary>
        /// Флаг, указывающий, добавлено ли аниме в избранное пользователем.
        /// </summary>
        public bool IsFavorite { get; set; }
    }
}