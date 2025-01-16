using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Mappers
{
    public static class AnimeMapper

    {
        public static AnimeShortDto ToShortDTO(this ShikimoriAnimeBase animeBase)
        {
            return new AnimeShortDto
            {
                Id = animeBase.Id,
                Title = animeBase.Title,
                SubTitle = animeBase.SubTitle,
                Description = animeBase.Description,
                Kind = animeBase.Kind,
                Status = animeBase.Status,
                Score = animeBase.Score,
                Duration = animeBase.Duration,
                Episodes = animeBase.Episodes,
                PictureUrl = animeBase.PictureUrl,
                StartDate = animeBase.StartDate,
            };
        }
    }
}
