namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// DTO, представляющий базовую информацию об аниме пользователя, используемую для агрегированных представлений.
    /// </summary>
    public class SeriesGroupDto
    {
        /// <summary>
        /// Идентификатор группы аниме (идентификатор категории).
        /// </summary>
        public required string Id { get; set; }

        /// <summary>
        /// Цвет, используемый для визуального представления группы аниме.
        /// </summary>
        public required string Color { get; set; }

        /// <summary>
        /// Количество аниме в группе.
        /// </summary>
        public int SeriesCount { get; set; }
    }
}