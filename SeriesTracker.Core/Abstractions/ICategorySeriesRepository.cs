

using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    public interface ICategorySeriesRepository
    {
        Task<Category?> GetCategoryBySeriesAnimeId(Guid userId, int animeId);

        Task<SeriesCategoryDto?> GetSeriesAnimeId(Guid userId, int animeId);
    }
}
