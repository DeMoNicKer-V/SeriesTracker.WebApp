using Newtonsoft.Json;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;


namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnime: ShikimoriAnimeBase
    {
        [JsonProperty("screenshots")] public Screenshot[] Screenshots { get; set; }
        [JsonProperty("related")] private IEnumerable<Related> RelatedData { get; set; }
        [JsonIgnore] public IEnumerable<Related> Relateds => RelatedData.Where(a => a.Anime != null && !new[] { "MUSIC", "PV", "CM" }.Any(c => a.Anime.Kind.Contains(c)));

    }
}

