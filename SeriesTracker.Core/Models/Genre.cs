using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models
{
    public class Genre
    {
        [JsonProperty("id")] public long Id { get; set; }
        [JsonProperty("russian")] public required string Russian { get; set; }
        [JsonProperty("kind")] public required string Kind { get; set; }


    }
}
