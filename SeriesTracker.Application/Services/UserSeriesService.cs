using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Application.Services
{
    public class UserSeriesService(
        IUserSeriesRepository userSeriesRepository) : IUserSeriesService
    {
        private readonly IUserSeriesRepository _userSeriesRepository = userSeriesRepository;

        public async Task<Guid> CreateAsync(Guid seriesId, Guid userId, int animeId, int categoryId, int watchedEpisodes, bool isFavorite)
        {
            var dateNow = DateTime.UtcNow.ToString("s");

            var userSeries = new UserSeries
                (
                    seriesId,
                    animeId,
                    userId,
                    categoryId,
                    watchedEpisodes,
                    dateNow,
                    dateNow,
                    isFavorite
                );

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


        public async Task<List<SeriesGroupDto>> GetGroupSeries(Guid userId)
        {
            return await _userSeriesRepository.GetGroupSeries(userId);
        }

        public async Task<List<SeriesGroupShortDto>> GetGroupShortSeries(string userName)
        {
            return await _userSeriesRepository.GetGroupShortSeries(userName);
        }

        public async Task<string> GetRecentSeriesString(Guid userId)
        {
            return await _userSeriesRepository.GetRecentSeriesString(userId);
        }

        public async Task<string> GetAnimeIdsString(string userName, int categoryId)
        {
            return await _userSeriesRepository.GetAnimeIdsString(userName, categoryId);
        }

        public async Task<Guid> UpdateSeries(Guid seriesDd, int watched, int categoryId, bool favorite)
        {
            var dateNow = DateTime.UtcNow.ToString("s");
            return await _userSeriesRepository.UpdateSeries(seriesDd, watched, categoryId, favorite, dateNow);
        }


    }
}