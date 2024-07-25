using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class Poster
    {
        [JsonProperty("originalUrl")] public string? OriginalUrl { get; set; }

        [JsonProperty("mainUrl")] public string? MainUrl { get; set; }

        [JsonProperty("miniUrl")] public string? MiniUrl { get; set; }
    }
}
