using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;
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

        public async Task<string> GetSeriesAnimeIdsList(string username, int categoryId)
        {
            var result = await _userSeriesRepository.GetSeriesAnimeIdsList(username, categoryId);
            return string.Join(",", result);
        }

        public async Task<Guid> DeleteAllSeriesByUserId(Guid userId)
        {
            return await _userSeriesRepository.DeleteAllSeriesByUserId(userId);
        }

        public async Task<List<SeriesGroupDto>> GetGroupSeries(Guid userId)
        {
            return await _userSeriesRepository.GetGroupSeries(userId);
        }
        public async Task<List<SeriesGroupShortDto>> GetGroupShortSeries(Guid userId)
        {
            return await _userSeriesRepository.GetGroupShortSeries(userId);
        }

        public async Task<string> GetRecentSeriesString(Guid userId)
        {
            return await _userSeriesRepository.GetRecentSeriesString(userId);
        }
    }
}
