using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class RelatedAnime : AnimeBase
    {
        [JsonProperty("airedOn")]
        public AiredDate airedOne { get; set; } = new AiredDate();

        [JsonProperty("kind")]
        private string? kindInfo { get; set; }

        [JsonIgnore]
        public string Kind => kindInfo != null ? kindInfo.ToUpper() : "";

        [JsonIgnore]
        public string StartDate => airedOne.Year ?? "Неизвестно";

    }
}
