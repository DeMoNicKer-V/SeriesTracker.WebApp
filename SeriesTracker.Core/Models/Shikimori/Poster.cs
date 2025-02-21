using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class Poster
    {
        [JsonIgnore]
        public string? Url
        {
            get
            {

                if (MainUrl != null)
                {
                    return MainUrl;
                }
                if (MainAltUrl != null)
                {
                    return MainAltUrl;
                }
                if (OriginalUrl != null)
                {
                    return OriginalUrl;
                }
                else if (MiniUrl != null) { return MiniUrl; }
                return null;
            }
        }

        [JsonProperty("mainUrl")] private string? MainUrl { get; set; }
        [JsonProperty("mini2xUrl")] private string? MiniUrl { get; set; }
        [JsonProperty("mainAltUrl")] private string? MainAltUrl { get; set; }
        [JsonProperty("originalUrl")] private string? OriginalUrl { get; set; }
    }
}