using Newtonsoft.Json;
using SeriesTracker.Core.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnimeFullDto : ShikimoriAnimeDto, IShikimoriAnimeFull
    {
        [JsonProperty("genres")]
        public Genre[]? Genres { get; set; }

        [JsonProperty("screenshots")]
        public Screenshot[]? Screenshots { get; set; }

        [JsonProperty("related")]
        public Related[]? Relateds { get; set; }
    }
}
