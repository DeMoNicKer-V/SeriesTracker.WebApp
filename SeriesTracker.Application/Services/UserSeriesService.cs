using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess;

namespace SeriesTracker.Application.Services
{
    public class UserSeriesService(IDbContextFactory<SeriesTrackerDbContext> contextFactory,
        IUserSeriesRepository userSeriesRepository, ICategoryRepository categoryRepository) : IUserSeriesService
    {
        private readonly ICategoryRepository _categoryRepository = categoryRepository;
        private readonly IUserSeriesRepository _userSeriesRepository = userSeriesRepository;
        private readonly IDbContextFactory<SeriesTrackerDbContext> _contextFactory = contextFactory;

        public async Task<Guid> CreateAsync(Guid seriesId, Guid userId, int animeId, int categoryId, int watchedEpisodes, bool isFavorite)
        {
            var dateNow = DateTime.UtcNow.ToString("s");

            var userSeries = new UserSeries(
            seriesId,
            animeId,
            userId,
            categoryId,
            watchedEpisodes,
            dateNow,
            dateNow,
            isFavorite);

            return await _userSeriesRepository.AddAsync(userSeries);
        }

        public async Task<Guid> DeleteAllSeriesByUserId(Guid userId)
        {
            return await _userSeriesRepository.DeleteAllSeriesByUserId(userId);
        }

        public async Task<Guid> DeleteSeries(Guid id)
        {
            return await _userSeriesRepository.DeleteSeries(id);
        }

        public async Task<int> GetAllSeriesCount()
        {
            return await _userSeriesRepository.GetAllSeriesCount();
        }

        public async Task<Category?> GetCategoryByAnimeSeries(int id, string userName)
        {
            using var context = _contextFactory.CreateDbContext();

            var series = await _userSeriesRepository.GetSeriesByAnimeIdAsync(id, userName);
            if (series == null)
            {
                return null;
            }

            var category = await _categoryRepository.GetCategoryById(series.CategoryId);
            return category;
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

        public async Task<string> GetSeriesAnimeIdsList(string userName, int categoryId)
        {
            var result = await _userSeriesRepository.GetSeriesAnimeIdsList(userName, categoryId);
            return string.Join(",", result);
        }

        public async Task<UserSeries?> GetSeriesByAnimeIdAsync(int id, string userName)
        {
            return await _userSeriesRepository.GetSeriesByAnimeIdAsync(id, userName);
        }

        public async Task<UserSeries> GetSeriesById(Guid id)
        {
            return await _userSeriesRepository.GetSeriesById(id);
        }

        public async Task<List<UserSeries>> GetSeriesList(string id)
        {
            return await _userSeriesRepository.GetSeriesList(id);
        }

        public async Task<Guid> UpdateSeries(Guid seriesDd, int watched, int categoryId, bool favorite)
        {
            var dateNow = DateTime.UtcNow.ToString("s");
            return await _userSeriesRepository.UpdateSeries(seriesDd, watched, categoryId, favorite, dateNow);
        }
    }
}