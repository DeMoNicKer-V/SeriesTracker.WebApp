using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class RelatedAnime
    {
        [JsonProperty("id")] public long Id { get; set; }
        [JsonProperty("name")] public string Name { get; set; }
    }
}
