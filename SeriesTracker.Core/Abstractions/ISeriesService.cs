using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    public interface ISeriesService
    {
        Task<Guid> CreateSeries(Series series);
        Task<Guid> DeleteSeries(Guid id);
        Task<List<Series>> GetSeriesList();
        Task<int> GetAllSeriesCount();
        Task<List<Series>> GetSearchList(string query);
        Task<Series> GetSeriesById(Guid id);
        Task<Guid> UpdateSeries(Guid id, int animeId, string title, string description, int watched, int last, int duration,
            float rating, string image, string release, string changed, string overDate, bool over, bool favorite);

        Task<bool> GetSeriesByAnimeId(int id);
    }
}