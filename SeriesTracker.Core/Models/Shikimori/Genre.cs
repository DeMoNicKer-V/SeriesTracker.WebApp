using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Представляет информацию о жанре аниме.
    /// </summary>
    public class Genre
    {
        /// <summary>
        /// Уникальный идентификатор жанра.
        /// </summary>
        [JsonProperty("id")]
        public long Id { get; set; }

        /// <summary>
        /// Название жанра на русском языке.
        /// </summary>
        [JsonProperty("russian")]
        public required string Russian { get; set; }

        /// <summary>
        /// Тип жанра (например, "genre", "theme").
        /// </summary>
        [JsonProperty("kind")]
        public required string Kind { get; set; }
    }
}