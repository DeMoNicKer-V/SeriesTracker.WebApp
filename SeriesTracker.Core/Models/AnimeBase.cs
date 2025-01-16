using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models
{
    public abstract class AnimeBase
    {
        [JsonIgnore] public abstract int Id { get; set; }
        [JsonIgnore] public abstract string Description { get; set; }
        [JsonIgnore] public abstract string Genres { get; set; }
        [JsonIgnore] public abstract double Duration { get; set; }
        [JsonIgnore] public abstract int Episodes { get; set; }
        [JsonIgnore] public abstract double Score { get; set; }
        [JsonIgnore] public abstract string StartDate { get; set; }
        [JsonIgnore] public abstract string Title { get; set; }
        [JsonIgnore] public abstract string SubTitle { get; set; }
        [JsonIgnore] public abstract string PictureUrl { get; set; }
        [JsonIgnore] public abstract string Rating { get; set; }
        [JsonIgnore] public abstract string Kind { get; set; }
        [JsonIgnore] public abstract string Status { get; set; }
        [JsonIgnore] public abstract Screenshot[] Screenshots { get; set; }
        [JsonIgnore] public abstract IEnumerable<Related> Relateds { get; }
    }
}
