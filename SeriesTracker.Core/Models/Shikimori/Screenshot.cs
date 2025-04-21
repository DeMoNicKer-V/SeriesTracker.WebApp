using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class Screenshot
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("originalUrl")]
        public string? OriginalUrl { get; set; }
    }
}