using Newtonsoft.Json;
using SeriesTracker.Core.Dtos;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class Related
    {
        [JsonProperty("anime")] 
        public AnimeBaseDto? Anime { get; set; }

        [JsonProperty("relationText")] 
        public string? RelationText { get; set; }
    }
}
