using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Представляет информацию о постере аниме.
    /// </summary>
    public class Poster
    {
        /// <summary>
        /// Возвращает URL адрес постера.
        /// </summary>
        [JsonIgnore]
        public string? Url => MainUrl ?? MainAltUrl ?? OriginalUrl ?? MiniUrl;

        /// <summary>
        /// URL адрес альтернативного основного постера.
        /// </summary>
        [JsonProperty("mainAltUrl")]
        private string? MainAltUrl { get; set; }

        /// <summary>
        /// URL адрес основного постера.
        /// </summary>
        [JsonProperty("mainUrl")]
        private string? MainUrl { get; set; }

        /// <summary>
        /// URL адрес уменьшенного постера (2x).
        /// </summary>
        [JsonProperty("mini2xUrl")]
        private string? MiniUrl { get; set; }
        /// <summary>
        /// URL адрес оригинального постера.
        /// </summary>
        [JsonProperty("originalUrl")]
        private string? OriginalUrl { get; set; }
    }
}