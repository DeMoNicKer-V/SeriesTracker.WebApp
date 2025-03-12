using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class CalendarImage
    {
        [JsonPropertyName("original")] public string Original { get; set; }
        [JsonPropertyName("preview")] public string Preview { get; set; }
    }
}
