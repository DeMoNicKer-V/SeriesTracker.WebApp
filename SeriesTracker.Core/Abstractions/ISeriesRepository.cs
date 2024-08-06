using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    public interface ISeriesRepository
    {
        Task<Guid> CreateSeries(Series series);
        Task<Guid> DeleteSeries(Guid id);
        Task<int> GetAllSeriesCount();
        Task<List<Series>> GetSeriesList();
        Task<Series> GetSeriesById(Guid id);
        Task<Guid> UpdateSeries(Guid id, int watched, string changed, int categoryId, bool favorite);
        Task<Guid> GetSeriesByAnimeId(int id);
    }
}