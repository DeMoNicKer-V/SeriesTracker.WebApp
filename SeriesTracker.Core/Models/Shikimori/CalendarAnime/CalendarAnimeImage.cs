using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Представляет информацию об изображении аниме в календаре релизов.
    /// </summary>
    public class CalendarAnimeImage
    {
        /// <summary>
        /// URL оригинального изображения.
        /// </summary>
        [JsonProperty("original")]
        public string? Original { get; set; }

        /// <summary>
        /// URL изображения для предпросмотра (preview).
        /// </summary>
        [JsonProperty("preview")]
        public string? Preview { get; set; }
    }
}