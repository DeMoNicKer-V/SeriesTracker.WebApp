using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Представляет информацию о скриншоте из аниме.
    /// </summary>
    public class Screenshot
    {
        /// <summary>
        /// Уникальный идентификатор скриншота.
        /// </summary>
        [JsonProperty("id")]
        public long Id { get; set; }

        /// <summary>
        /// URL адрес оригинального скриншота.
        /// </summary>
        [JsonProperty("originalUrl")]
        public string? OriginalUrl { get; set; }
    }
}