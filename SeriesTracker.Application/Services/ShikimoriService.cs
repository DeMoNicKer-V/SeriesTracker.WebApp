using AutoMapper;
using Microsoft.Extensions.Logging;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Application.Services
{
    public class ShikimoriService : IShikimoriService
    {
        private readonly ILogger<ShikimoriService> _logger;
        private readonly IMapper _mapper;

        public ShikimoriService(IMapper mapper, ILogger<ShikimoriService> logger)
        {
            _mapper = mapper;
            _logger = logger;
        }

        public AnimeFullDto MapToFullDto(ShikimoriAnimeBase anime)
        {
            return _mapper.Map<AnimeFullDto>(anime);
        }

        public AnimeShortDto MapToShortDto(ShikimoriAnimeBase anime)
        {
            return _mapper.Map<AnimeShortDto>(anime);
        }

        public AnimeSeriesDto MapToAnimeSeriesDto(ShikimoriAnimeBase anime, int categoryId, string categoryName, string categoryColor)
        {
            return _mapper.Map<AnimeSeriesDto>(anime, opt =>
            {
                opt.Items["CategoryId"] = categoryId;
                opt.Items["CategoryName"] = categoryName;
                opt.Items["CategoryColor"] = categoryColor;
            });
        }

        public object MapToAnimeSeriesFullDto(ShikimoriAnimeBase anime, SeriesCategoryDto? series, bool isFull)
        {
            if (series == null)
            {
                return isFull ? _mapper.Map<AnimeFullDto>(anime) : _mapper.Map<AnimeShortDto>(anime);
            }
            return _mapper.Map<AnimeSeriesFullDto>(anime, opt =>
            {

                opt.Items["SeriesId"] = series.SeriesId;
                opt.Items["CategoryId"] = series.CategoryId;
                opt.Items["CategoryName"] = series.CategoryName;
                opt.Items["CategoryColor"] = series.CategoryColor;
                opt.Items["WatchedEpisodes"] = series.WatchedEpisodes;
                opt.Items["AddedDate"] = series.AddedDate;
                opt.Items["IsFavorite"] = series.IsFavorite;
                opt.Items["ChangedDate"] = series.ChangedDate;

            });
        }

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

        public async Task<ShikimoriAnimeBaseList> GetAnimesByAllParams(int page, string name, string season, 
            string status, string kind, string genre, string order, bool censored)
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetAnimes(page, name, season,
                 status, kind, genre, order, censored), _logger);
        }

        public async Task<ShikimoriAnimeBaseList> GetAnimesByAllParamsAndIds(int page, string name, string ids, string season, 
            string status, string kind, string genre, string order, bool censored)
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetAnimesByIds(page, name, ids, season, 
                status, kind, genre, order, censored), _logger);
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
