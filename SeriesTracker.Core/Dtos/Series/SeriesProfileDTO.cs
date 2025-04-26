namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// DTO, представляющий информацию об аниме пользователя (в профиле).
    /// </summary>
    public class SeriesProfileDTO
    {
        /// <summary>
        /// Список сгруппированных аниме пользователя.
        /// </summary>
        public List<SeriesGroupFullDto>? CategoryGroups { get; set; }

        /// <summary>
        /// Строка, содержащая Id последних пяти аниме пользователя (по дате изменения).
        /// </summary>
        public string? LastFiveSeries { get; set; }
    }
}