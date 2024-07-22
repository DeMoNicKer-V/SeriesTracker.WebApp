using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class Screenshot
    {
        [JsonProperty("id")] public long Id { get; set; }
        [JsonProperty("originalUrl")] public string OriginalUrl { get; set; }
    }
}
