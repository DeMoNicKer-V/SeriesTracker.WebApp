using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class Related
    {
        [JsonProperty("id")] public long Id { get; set; }

        [JsonProperty("anime")] public RelatedAnime [] Anime { get; set; }
    }
}
