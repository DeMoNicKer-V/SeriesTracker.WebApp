namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// DTO, представляющий информацию о категории, к которой принадлежит аниме в списке пользователя.
    /// </summary>
    public class SeriesCategoryDto
    {
        /// <summary>
        /// Уникальный идентификатор аниме в списке пользователя.
        /// </summary>
        public Guid SeriesId { get; set; }

        /// <summary>
        /// Идентификатор аниме, к которому относится аниме.
        /// </summary>
        public int AnimeId { get; set; }

        /// <summary>
        /// Идентификатор категории, к которой отнесен аниме.
        /// </summary>
        public int CategoryId { get; set; }

        /// <summary>
        /// Название категории, к которой отнесен аниме.
        /// </summary>
        public required string CategoryName { get; set; }

        /// <summary>
        /// Цвет категории, к которой отнесен аниме (например, в формате HEX).
        /// </summary>
        public required string CategoryColor { get; set; }

        /// <summary>
        /// Количество просмотренных эпизодов аниме пользователем.
        /// </summary>
        public int WatchedEpisodes { get; set; }

        /// <summary>
        /// Дата добавления аниме в список пользователя.
        /// </summary>
        public required string AddedDate { get; set; }

        /// <summary>
        /// Дата последнего изменения информации о аниме в списке пользователя.
        /// </summary>
        public required string ChangedDate { get; set; }

        /// <summary>
        /// Флаг, указывающий, добавлен ли аниме в избранное пользователя.
        /// </summary>
        public bool IsFavorite { get; set; }
    }
}