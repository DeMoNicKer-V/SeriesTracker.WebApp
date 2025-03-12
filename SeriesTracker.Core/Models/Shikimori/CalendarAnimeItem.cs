using System.Text.Json;
using System.Text.Json.Serialization;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class CalendarAnimeItem
    {
        [JsonPropertyName("next_episode")] public int NextEpisode { get; set; }
        [JsonPropertyName("next_episode_at")] public string NextEpisodeDate { get; set; }
        [JsonPropertyName("anime")] public CalendarAnime Anime { get; set; } = new();
    }
}
