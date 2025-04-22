using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnimeFullDto : ShikimoriAnimeDto
    {
        [JsonProperty("screenshots")]
        public Screenshot[]? Screenshots { get; set; }

        [JsonProperty("related")]
        public Related[]? Relatedes { get; set; }
    }
}
