using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Application.Extensions
{
    public static class AnimeMapperExtensions
    {
        public static AnimeSeriesDto MapToShortSeriesDto(this IMapper mapper, ShikimoriAnimeBase anime, SeriesCategoryDto? series)
        {
            if (series == null)
            {
                return mapper.Map<AnimeSeriesDto>(anime, opt => { });
            }

            return mapper.Map<AnimeSeriesDto>(anime, opt =>
            {
                opt.Items["CategoryId"] = series.CategoryId;
                opt.Items["CategoryName"] = series.CategoryName;
                opt.Items["CategoryColor"] = series.CategoryColor;
            });
        }

        public static AnimeSeriesFullDto MapToFullSeriesDto(this IMapper mapper, ShikimoriAnimeBase anime, SeriesCategoryDto? series)
        {
            if (series == null)
            {
                return mapper.Map<AnimeSeriesFullDto>(anime, opt => { });
            }

            return mapper.Map<AnimeSeriesFullDto>(anime, opt =>
            {
                opt.Items["SeriesId"] = series.SeriesId;
                opt.Items["CategoryId"] = series.CategoryId;
                opt.Items["CategoryName"] = series.CategoryName;
                opt.Items["CategoryColor"] = series.CategoryColor;
                opt.Items["WatchedEpisodes"] = series.WatchedEpisodes;
                opt.Items["AddedDate"] = series.AddedDate;
                opt.Items["IsFavorite"] = series.IsFavorite;
                opt.Items["ChangedDate"] = series.ChangedDate;
            });
        }

        public static AnimeFullDto MapToFullAnimeDTO(this IMapper mapper, ShikimoriAnimeBase anime)
        {
            return mapper.Map<AnimeFullDto>(anime);
        }

        public static AnimeShortDto MapToShortAnimeDTO(this IMapper mapper, ShikimoriAnimeBase anime)
        {
            return mapper.Map<AnimeShortDto>(anime);
        }
    }
}
