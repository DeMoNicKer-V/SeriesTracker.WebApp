using Newtonsoft.Json;
using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Dtos.Anime
{
    public class AnimeShortDto
    {
        [JsonIgnore] public int Id { get; set; }
        [JsonIgnore] public string Description { get; set; }
        [JsonIgnore] public double Duration { get; set; }
        [JsonIgnore] public int Episodes { get; set; }
        [JsonIgnore] public double Score { get; set; }
        [JsonIgnore] public string StartDate { get; set; }
        [JsonIgnore] public string Title { get; set; }
        [JsonIgnore] public string SubTitle { get; set; }
        [JsonIgnore] public string PictureUrl { get; set; }
        [JsonIgnore] public string Kind { get; set; }
        [JsonIgnore] public string Status { get; set; }
    }
}
