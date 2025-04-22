using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class Related
    {
        [JsonProperty("anime")] 
        public RelatedAnime? Anime { get; set; }

        [JsonProperty("relationText")] 
        public string? RelationText { get; set; }
    }
}
