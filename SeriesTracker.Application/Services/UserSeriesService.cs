using Microsoft.Extensions.Logging;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Application.Services
{
    public class UserSeriesService(
        IUserSeriesRepository userSeriesRepository, ILogger<UserSeriesService> logger) : IUserSeriesService
    {
        private readonly IUserSeriesRepository _userSeriesRepository = userSeriesRepository;
        private readonly ILogger<UserSeriesService> _logger = logger;

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

        public async Task<ShikimoriAnimeBase[]> GetUserSeriesList(string userName, int page, int categoryId, bool isFavorite)
        {
            var animeIds = await _userSeriesRepository.GetAnimeIdsList(userName, page, categoryId, isFavorite);

            if (animeIds.Count == 0)
            {
                return [];
            }

            var idsString = string.Join(",", animeIds);
            var data = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetAnimesByIds(idsString), _logger);
            return data.Animes;
        }

        public async Task<Guid> UpdateSeries(Guid seriesDd, int watched, int categoryId, bool favorite)
        {
            var dateNow = DateTime.UtcNow.ToString("s");
            return await _userSeriesRepository.UpdateSeries(seriesDd, watched, categoryId, favorite, dateNow);
        }


    }
}