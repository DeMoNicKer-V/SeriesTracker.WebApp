using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;


namespace SeriesTracker.Core.Abstractions
{
    public interface ICategorySeriesService
    {
        Task<Category?> GetCategoryBySeriesAnimeId(Guid userId, int animeId);

        Task<SeriesCategoryDto?> GetSeriesAnimeId(string userName, int animeId);
    }
}
