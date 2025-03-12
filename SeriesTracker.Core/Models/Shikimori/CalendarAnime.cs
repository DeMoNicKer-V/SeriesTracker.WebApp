﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class CalendarAnime
    {
        [JsonPropertyName("id")] public int Id { get; set; }
        [JsonPropertyName("name")] public string Name { get; set; }
        [JsonPropertyName("russian")] public string Russian { get; set; }
        [JsonPropertyName("image")] public CalendarImage Image { get; set; } = new();
        [JsonPropertyName("episodes")] public int Episodes { get; set; }
        [JsonPropertyName("episodes_aired")] public int EpisodesAired { get; set; }
    }
}
