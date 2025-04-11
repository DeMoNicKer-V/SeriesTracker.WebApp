using SeriesTracker.Core.Dtos.Series;

namespace SeriesTracker.Core.Abstractions
{
    public interface ICategorySeriesRepository
    {
        Task<Dictionary<int, SeriesCategoryDto>> GetSeriesAnimeId(Guid userId, List<int> animeIds);
    }
}