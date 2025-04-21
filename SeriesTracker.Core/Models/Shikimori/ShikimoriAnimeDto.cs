using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnimeDto : AnimeBase
    {
        [JsonProperty("genres")]
        public Genre[]? Genre { get; set; }

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

        [JsonProperty("screenshots")]
        public Screenshot[]? Screenshots { get; set; }

        [JsonProperty("related")]
        public Related[]? Relatedes { get; set; }
    }
}