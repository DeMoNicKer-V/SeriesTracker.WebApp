using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    /// <summary>
    /// Представляет элемент аниме в календаре релизов, включающий информацию об аниме и следующем эпизоде.
    /// </summary>
    public class CalendarAnimeItem
    {
        /// <summary>
        /// Информация об аниме.
        /// </summary>
        [JsonProperty("anime")]
        public CalendarAnime Anime { get; set; } = new();

        /// <summary>
        /// Номер следующего эпизода.
        /// </summary>
        [JsonProperty("next_episode")]
        public int NextEpisode { get; set; }

        /// <summary>
        /// Дата и время выхода следующего эпизода (в формате строки).
        /// </summary>
        [JsonProperty("next_episode_at")]
        public required string NextEpisodeAt { get; set; }
    }
}