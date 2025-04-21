using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class CalendarAnimeItem
    {
        [JsonProperty("anime")]
        public CalendarAnime Anime { get; set; } = new();

        [JsonProperty("next_episode")]
        public int NextEpisode { get; set; }

        [JsonProperty("next_episode_at")]
        public string? NextEpisodeAt { get; set; }
    }
}