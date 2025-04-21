using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class RelatedAnime : AnimeBase
    {
        [JsonProperty("kind")]
        private string? KindInfo { get; set; }

        [JsonIgnore]
        public string Kind => AnimeConverter.ConvertKindToRussian(KindInfo);
    }
}