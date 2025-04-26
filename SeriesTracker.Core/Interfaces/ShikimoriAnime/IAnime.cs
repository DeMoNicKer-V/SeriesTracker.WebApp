namespace SeriesTracker.Core.Interfaces
{
    /// <summary>
    /// Определяет базовый контракт для представления аниме.
    /// </summary>
    public interface IAnime
    {
        /// <summary>
        /// Уникальный идентификатор аниме.
        /// </summary>
        int Id { get; set; }

        /// <summary>
        /// Тип аниме (например, ТВ, фильм, OVA).
        /// </summary>

        // Только геттер, т.к. значение вычисляется на основе других свойств.
        string? Kind { get; set; }

        /// <summary>
        /// URL адрес изображения постера аниме.
        /// </summary>

        // Только геттер, т.к. значение вычисляется на основе других свойств.
        string? PictureUrl { get; }

        /// <summary>
        /// Дата начала показа аниме.
        /// </summary>

        // Только геттер, т.к. значение вычисляется на основе других свойств.
        string? StartDate { get; }

        /// <summary>
        /// Альтернативное название аниме.
        /// </summary>
        string? SubTitle { get; set; }

        /// <summary>
        /// Основное название аниме.
        /// </summary>
        string? Title { get; set; }
    }
}