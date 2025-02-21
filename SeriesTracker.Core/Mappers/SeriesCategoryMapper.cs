using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;

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
