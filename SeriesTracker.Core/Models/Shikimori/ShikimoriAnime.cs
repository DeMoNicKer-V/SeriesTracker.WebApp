using Newtonsoft.Json;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;


namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnime: ShikimoriAnimeBase
    {
        private static readonly string[] sourceArray = ["MUSIC", "PV", "CM"];
        [JsonProperty("screenshots")] public Screenshot[]? Screenshots { get; set; }
        [JsonProperty("related")] private Related[]? RelatedData { get; set; }
        [JsonIgnore] public IEnumerable<Related>? Relateds => RelatedData?.Where(a => a.Anime != null && !sourceArray.Any(c => a.Anime.Kind.Contains(c)));
    }
}

