using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    public interface ISeriesService
    {
        Task<Guid> CreateSeries(Series series);
        Task<Guid> DeleteSeries(Guid id);
        Task<List<Series>> GetSeriesList();
        Task<int> GetAllSeriesCount();
        Task<Series> GetSeriesById(Guid id);
        Task<Guid> UpdateSeries(Guid id, int watched, string changed, int categoryId, bool favorite);
        Task<Guid> GetSeriesByAnimeId(int id);

    }
}