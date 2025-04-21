using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public abstract class AnimeBase
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string? SubTitle { get; set; }

        [JsonProperty("russian")]
        public string? Title { get; set; }

        [JsonProperty("poster")]
        public Poster? Poster { get; set; } = new();

        [JsonIgnore]
        public string? PictureUrl => Poster?.Url;
    }
}
