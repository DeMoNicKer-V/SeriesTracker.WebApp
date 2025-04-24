using Newtonsoft.Json;
using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
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