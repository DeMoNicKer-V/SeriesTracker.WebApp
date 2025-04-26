namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// DTO, представляющий базовую информацию об аниме пользователя, используемую для агрегированных представлений.
    /// </summary>
    public class SeriesGroupFullDto : SeriesGroupDto
    {
        /// <summary>
        /// Название группы аниме.
        /// </summary>
        public required string Name { get; set; }
    }
}