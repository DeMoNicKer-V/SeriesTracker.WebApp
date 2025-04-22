using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class Genre
    {
        [JsonProperty("id")] 
        public long Id { get; set; }

        [JsonProperty("russian")] 
        public required string Russian { get; set; }

        [JsonProperty("kind")] 
        public required string Kind { get; set; }


    }
}
