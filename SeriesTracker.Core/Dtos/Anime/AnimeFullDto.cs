using Newtonsoft.Json;
using SeriesTracker.Core.Models.Shikimori;
using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Dtos.Anime
{
     public record AnimeFullDto
    (
         string? Description,
         int Episodes,
         int EpisodesAired,
         string Genres,
         int Id,
         string Kind,
         string? PictureUrl,
         string Rating,
         string StartDate,
         string Status,
         string? SubTitle,
         string? Title,
         double? Score,
         int? Duration,
         IEnumerable<Related>? Relateds,
         Screenshot[]? Screenshots
    );
}