using AutoMapper;
using Microsoft.Extensions.Logging;
using SeriesTracker.Application.Extensions;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Application.Services
{
    public class ShikimoriService(IMapper mapper, ILogger<ShikimoriService> logger, ICategorySeriesRepository categorySeriesRepository, IUserRepository userRepository) : IShikimoriService
    {
        private readonly ILogger<ShikimoriService> _logger = logger;
        private readonly IMapper _mapper = mapper;
        private readonly ICategorySeriesRepository _categorySeriesRepository = categorySeriesRepository;
        private readonly IUserRepository _userRepository = userRepository;

        public async Task<AnimeSeriesDto[]> GetAnimesByName(Guid userId, string animeName)
        {
            var animeResponse = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetAnimesByName(animeName), _logger);
            var animeIds = animeResponse.Animes.Select(s => s.Id).ToList();

            var response = await _categorySeriesRepository.GetSeriesAnimeId(userId, animeIds);

            var animeTasks = animeResponse.Animes
            .Select(item =>
            {
                return _mapper.MapToShortSeriesDto(item, response.FirstOrDefault(c => c.AnimeId == item.Id));
            }).ToArray();

            return animeTasks;
        }

        public async Task<AnimeSeriesFullDto> GetAnimeById(Guid userId, string animeId)
        {
            var animeResponse = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetAnimeById(animeId), _logger);
            var series = await _categorySeriesRepository.GetSeriesAnimeId(userId, [animeResponse.Animes[0].Id]);

            return _mapper.MapToFullSeriesDto(animeResponse.Animes[0], series.FirstOrDefault());
        }

        public async Task<AnimeSeriesFullDto[]> GetAnimeListByIds(string userName, string Ids)
        {
            var animeResponse = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetRecentAnimes(Ids), _logger);

            var user = await _userRepository.GetUserByUserName(userName);
            var animeIds = animeResponse.Animes.Select(s => s.Id).ToList();

            var response = await _categorySeriesRepository.GetSeriesAnimeId(user.Id, animeIds);

            var animeTasks = animeResponse.Animes
            .Select(item =>
            {
                return _mapper.MapToFullSeriesDto(item, response.FirstOrDefault(c => c.AnimeId == item.Id));
            }).ToArray();

            return animeTasks.OrderByDescending(m => m.ChangedDate).ToArray();
        }

        public async Task<AnimeSeriesDto[]> GetAnimesByAllParams(Guid userId, int page, string name, string season,
            string status, string kind, string genre, string order, bool censored)
        {
            var animeResponse = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetAnimes(page, name, season,
                 status, kind, genre, order, censored), _logger);

            var animeIds = animeResponse.Animes.Select(s => s.Id).ToList();

            var response = await _categorySeriesRepository.GetSeriesAnimeId(userId, animeIds);

            var animeTasks = animeResponse.Animes
            .Select(item =>
            {

                return _mapper.MapToShortSeriesDto(item, response.FirstOrDefault(c => c.AnimeId == item.Id));
            }).ToArray();

            return animeTasks;
        }

        public async Task<GenreList> GetGenres()
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<GenreList>(GraphQLQueries.GetGenres(), _logger);
        }

        public async Task<ShikimoriAnimeBaseList> GetRandomAnime()
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetRandomAnime(), _logger);
        }
    }
}