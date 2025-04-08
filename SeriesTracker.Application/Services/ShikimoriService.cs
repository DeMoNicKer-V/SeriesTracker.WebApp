using AutoMapper;
using Microsoft.Extensions.Logging;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Application.Services
{
    public class ShikimoriService(IMapper mapper, ILogger<ShikimoriService> logger, ICategorySeriesRepository categorySeriesRepository) : IShikimoriService
    {
        private readonly ILogger<ShikimoriService> _logger = logger;
        private readonly IMapper _mapper = mapper;
        private readonly ICategorySeriesRepository _categorySeriesRepository = categorySeriesRepository;

        public async Task<ShikimoriAnimeBaseList> GetAnimesByName(string name)
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetAnimesByName(name), _logger);
        }

        public async Task<ShikimoriAnimeBaseList> GetAnimeById(string id)
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetAnimeById(id), _logger);
        }

        public async Task<ShikimoriAnimeBaseList> GetAnimeListByIds(string ids)
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetRecentAnimes(ids), _logger);
        }

        public async Task<AnimeSeriesDto[]> GetAnimesByAllParams(Guid userId, int page, string name, string season,
            string status, string kind, string genre, string order, bool censored)
        {
            var response = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetAnimes(page, name, season,
                 status, kind, genre, order, censored), _logger);

            var animeTasks = response.Animes
            .Select(async item =>
            {
                var response = await _categorySeriesRepository.GetSeriesAnimeId(userId, item.Id);
                return MapToShortSeriesDto(item, response);
            });

            var mappedAnimes = await Task.WhenAll(animeTasks);
            return mappedAnimes;
        }

        public async Task<GenreList> GetGenres()
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<GenreList>(GraphQLQueries.GetGenres(), _logger);
        }

        public async Task<ShikimoriAnimeBaseList> GetRandomAnime()
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetRandomAnime(), _logger);
        }

        public AnimeSeriesDto MapToShorSeriesDto(ShikimoriAnimeBase anime, SeriesCategoryDto? series)
        {
            if (series == null)
            {
                return _mapper.Map<AnimeSeriesDto>(anime, opt => { });
            }

            return _mapper.Map<AnimeSeriesDto>(anime, opt =>
            {
                opt.Items["CategoryId"] = series.CategoryId;
                opt.Items["CategoryName"] = series.CategoryName;
                opt.Items["CategoryColor"] = series.CategoryColor;
            });
        }

        private AnimeShortDto MapToShorAnimeDto(ShikimoriAnimeBase anime)
        {
            return _mapper.Map<AnimeShortDto>(anime);
        }
    }
}