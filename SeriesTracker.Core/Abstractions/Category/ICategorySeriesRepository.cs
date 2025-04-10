

using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    public interface ICategorySeriesRepository
    {
        Task<Category?> GetCategoryBySeriesAnimeId(Guid userId, int animeId);

        Task<List<SeriesCategoryDto>> GetSeriesAnimeId(Guid userId, List<int> animeIds);
    }
}
