using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Application.Services
{
    public class UserSeriesService : IUserSeriesService
    {
        private readonly IUserSeriesRepository _userSeriesRepository;

        public UserSeriesService(IUserSeriesRepository userSeriesRepository)
        {
            _userSeriesRepository = userSeriesRepository;
        }

        public async Task<UserSeries?> GetSeriesByAnimeIdAsync(int id)
        {
            return await _userSeriesRepository.GetSeriesByAnimeIdAsync(id);
        }

        public async Task<Guid> CreateAsync(UserSeries model)
        {
            return await _userSeriesRepository.CreateAsync(model);
        }

        public async Task<Guid> DeleteSeries(Guid id)
        {
            return await _userSeriesRepository.DeleteSeries(id);
        }
        public async Task<int> GetAllSeriesCount()
        {
            return await _userSeriesRepository.GetAllSeriesCount();
        }
        public async Task<UserSeries> GetSeriesById(Guid id)
        {
            return await _userSeriesRepository.GetSeriesById(id);
        }
        public async Task<List<UserSeries>> GetSeriesList(string id)
        {
            return await _userSeriesRepository.GetSeriesList(id);
        }
        public async Task<Guid> UpdateSeries(Guid id, int watched, string changed, int categoryId, bool favorite)
        {
            return await _userSeriesRepository.UpdateSeries(id, watched, changed, categoryId, favorite);
        }
    }
}
