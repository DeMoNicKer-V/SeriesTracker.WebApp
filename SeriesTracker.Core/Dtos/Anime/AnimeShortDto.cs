using Newtonsoft.Json;
using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Dtos.Anime
{
    public record AnimeShortDto
   (
       int Id,
       string? Description,
       double Duration,
       int Episodes,
       double Score,
        string StartDate,
        string Title,
        string SubTitle,
       string? PictureUrl,
        string Kind,
        string Status,
       string? Rating
   );
}