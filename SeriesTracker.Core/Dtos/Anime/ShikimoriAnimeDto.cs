using Newtonsoft.Json;
using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    public class ShikimoriAnimeDto : AnimeBaseDto, IShikimoriAnime
    {
        [JsonProperty("score")]
        public double Score { get; set; }

        [JsonProperty("description")]
        public string? Description { get; set; }

        [JsonProperty("duration")]
        public int Duration { get; set; }

        [JsonProperty("status")]
        public string? Status { get; set; }

        [JsonProperty("rating")]
        public string? Rating { get; set; }

        [JsonProperty("episodes")]
        public int Episodes { get; set; }

        [JsonProperty("episodesAired")]
        public int EpisodesAired { get; set; }
    }
}