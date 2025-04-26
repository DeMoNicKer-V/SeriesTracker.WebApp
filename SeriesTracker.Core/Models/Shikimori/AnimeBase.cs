using SeriesTracker.Core.Interfaces;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Реализует базовый интерфейс <see cref="IAnime"/>, предоставляя общие свойства для всех типов аниме.
    /// </summary>
    public class AnimeBase : IAnime
    {
        /// <summary>
        /// Уникальный идентификатор аниме.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Тип аниме (например, ТВ, фильм, OVA).
        /// </summary>
        public string? Kind { get; set; }

        /// <summary>
        /// URL адрес изображения постера аниме.
        /// </summary>
        public string? PictureUrl { get; set; }

        /// <summary>
        /// Дата начала показа аниме.
        /// </summary>
        public string? StartDate { get; set; }

        /// <summary>
        /// Альтернативное название аниме.
        /// </summary>
        public string? SubTitle { get; set; }

        /// <summary>
        /// Основное название аниме.
        /// </summary>
        public string? Title { get; set; }
    }
}