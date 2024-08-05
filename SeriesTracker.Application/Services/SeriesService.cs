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

        public async Task<Guid> UpdateSeries(Guid id, int watched, string changed, int categoryId, bool favorite)
        {
            return await _seriesRepository.UpdateSeries(id, watched, changed, categoryId, favorite);
        }

        public async Task<Guid> DeleteSeries(Guid id)
        {
            return await _seriesRepository.DeleteSeries(id);
        }

        public async Task<int> GetAllSeriesCount()
        {
            return await _seriesRepository.GetAllSeriesCount();
        }

        public async Task<bool> GetSeriesByAnimeId(int id)
        {
            return await _seriesRepository.GetSeriesByAnimeId(id);
        }
    }
}
