using Newtonsoft.Json;
using SeriesTracker.Core.Interfaces;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class RelatedAnime : AnimeBase, IAnime
    {
        [JsonProperty("kind")]
        private string? KindInfo { get; set; }

        [JsonIgnore]
        public string Kind => AnimeConverter.ConvertKindToRussian(KindInfo);
    }
}