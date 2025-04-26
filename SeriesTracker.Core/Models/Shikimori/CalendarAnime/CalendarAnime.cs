using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Представляет аниме в календаре релизов.
    /// </summary>
    public class CalendarAnime
    {
        /// <summary>
        /// Идентификатор аниме.
        /// </summary>
        [JsonProperty("id")]
        public int Id { get; set; }

        /// <summary>
        /// Оригинальное название аниме.
        /// </summary>
        [JsonProperty("name")]
        public string? Name { get; set; }

        /// <summary>
        /// Название аниме на русском языке.
        /// </summary>
        [JsonProperty("russian")]
        public string? Russian { get; set; }

        /// <summary>
        /// Информация об изображених аниме.
        /// </summary>
        [JsonProperty("image")]
        public CalendarAnimeImage Image { get; set; } = new();

        /// <summary>
        /// Общее количество эпизодов в аниме.
        /// </summary>
        [JsonProperty("episodes")]
        public int Episodes { get; set; }

        /// <summary>
        /// Количество уже вышедших эпизодов аниме.
        /// </summary>
        [JsonProperty("episodes_aired")]
        public int EpisodesAired { get; set; }
    }
}