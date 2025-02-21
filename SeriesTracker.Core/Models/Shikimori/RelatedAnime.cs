using Newtonsoft.Json;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class RelatedAnime
    {
        public RelatedAnime()
        {
            airedOne = new AiredDate();
            poster = new Poster();
        }
        [JsonProperty("airedOn")] public AiredDate airedOne { get; set; }
        [JsonProperty("poster")] public Poster poster { get; set; }
        [JsonProperty("id")] public string Id { get; set; }
        [JsonProperty("name")] public string SubTitle { get; set; }
        [JsonProperty("russian")] public string Title { get; set; }
        [JsonIgnore] public string Kind { get { return kindInfo != null ? kindInfo.ToUpper() : ""; } set { } }
        [JsonProperty("kind")] private string? kindInfo { get; set; }
        [JsonIgnore] public string? PictureUrl { get { return poster != null ? poster.Url : null; } }
        [JsonIgnore]
        public string StartDate
        {
            get
            {
                return airedOne.Year != null ? airedOne.Year.ToString() : "Неизвестно";
            }
            set { }
        }
    }
}
