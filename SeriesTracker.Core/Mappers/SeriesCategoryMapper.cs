using AutoMapper;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Dtos.UserDtos;
using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Mappers
{
    public static class SeriesCategoryMapper 
    {
        public static SeriesCategoryDto ToSeriesCategoryDTO(this UserSeries series, Category category)
        {
            return new SeriesCategoryDto
            {
                SeriesId = series.Id,
                CategoryId = category.Id,
                CategoryName = category.Name,
                CategoryColor = category.Color,
                WatchedEpisodes = series.WatchedEpisode,
                AddedDate = series.AddedDate,
                IsFavorite = series.IsFavorite,
            };
        }
    }
}
