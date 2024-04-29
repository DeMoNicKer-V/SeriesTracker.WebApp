using SeriesTracker.Core.Models;
using SeriesTracker.Core.Abstractions;

namespace SeriesTracker.Application.Services
{
    public class SeriesService : ISeriesService
    {
        private readonly ISeriesRepository _seriesRepository;

        public SeriesService(ISeriesRepository seriesRepository)
        {
            _seriesRepository = seriesRepository;
        }

        public async Task<List<Series>> GetSeriesList()
        {
            return await _seriesRepository.GetSeriesList();
        }

        public async Task<Series> GetSeriesById(Guid id)
        {
            return await _seriesRepository.GetSeriesById(id);
        }

        public async Task<Guid> CreateSeries(Series series)
        {
            return await _seriesRepository.CreateSeries(series);
        }

        public async Task<Guid> UpdateSeries(Guid id, string title, string description, int watched, int last, int duration,
            float rating, string image, string release, string changed, string overDate, bool over, bool favorite)
        {
            return await _seriesRepository.UpdateSeries(id, title, description, watched, last, duration, rating, image, release, changed, overDate, over, favorite);
        }

        public async Task<Guid> DeleteSeries(Guid id)
        {
            return await _seriesRepository.DeleteSeries(id);
        }

        public async Task<int> GetAllSeriesCount()
        {
            return await _seriesRepository.GetAllSeriesCount();
        }

    }
}
