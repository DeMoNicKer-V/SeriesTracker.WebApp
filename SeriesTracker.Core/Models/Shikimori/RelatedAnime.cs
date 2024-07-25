using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class RelatedAnime
    {
        [JsonProperty("airedOn")] public AiredDate airedOne = new();
        [JsonProperty("poster")] public Poster poster = new();
        [JsonProperty("id")] public string Id { get; set; }
        [JsonProperty("name")] public string SubTitle { get; set; }
        [JsonProperty("russian")] public string Title { get; set; }
        [JsonIgnore] public string Kind { get { return kindInfo != null ? kindInfo.ToUpper() : ""; } set { } }
        [JsonProperty("kind")] private string? kindInfo { get; set; }    
        [JsonIgnore] public string PictureUrl { get { return poster.MiniUrl != null ? poster.MiniUrl : poster.MiniUrl; } }
        [JsonIgnore]
        public  int StartDate
        {
            get
            {
                return airedOne.Year;
            }
            set { }
        }
    }
}
