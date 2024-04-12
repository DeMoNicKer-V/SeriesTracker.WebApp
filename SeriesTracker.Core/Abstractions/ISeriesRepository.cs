using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    public interface ISeriesRepository
    {
        Task<Guid> CreateSeries(Series series);
        Task<Guid> DeleteSeries(Guid id);
        Task<List<Series>> GetSeriesList();
        Task<Guid> UpdateSeries(Guid id, string title, string description, int watched, int last, int duration, 
            float rating, string release, string added, string overDate, string changed, bool over, bool favorite);
    }
}