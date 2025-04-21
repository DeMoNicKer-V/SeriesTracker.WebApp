using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class CalendarAnime
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("russian")]
        public string Russian { get; set; }

        [JsonProperty("image")]
        public CalendarImage Image { get; set; } = new();

        [JsonProperty("episodes")]
        public int Episodes { get; set; }

        [JsonProperty("episodes_aired")]
        public int EpisodesAired { get; set; }
    }
}
