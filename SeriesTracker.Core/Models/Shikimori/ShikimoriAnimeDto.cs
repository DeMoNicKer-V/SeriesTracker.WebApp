using Newtonsoft.Json;
using SeriesTracker.Core.Abstractions;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnimeDto : AnimeBase, IShikimoriAnime
    {
        [JsonProperty("score")]
        public double Score { get; set; }

        [JsonProperty("description")]
        public string? Description { get; set; }

        [JsonProperty("duration")]
        public int Duration { get; set; }

        [JsonProperty("kind")]
        public string? Kind { get; set; }

        [JsonProperty("status")]
        public string? Status { get; set; }

        [JsonProperty("rating")]
        public string? Rating { get; set; }
    }
}