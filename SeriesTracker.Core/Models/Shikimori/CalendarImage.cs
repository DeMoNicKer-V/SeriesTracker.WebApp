using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class CalendarImage
    {
        [JsonProperty("original")] public string Original { get; set; }
        [JsonProperty("preview")] public string Preview { get; set; }
    }
}
