using SeriesTracker.Core.Models;


namespace SeriesTracker.Core.Abstractions
{
    public interface ICategorySeriesService
    {
        Task<Category> GetCategoryBySeriesAnimeId(Guid userId, int animeId);
    }
}
