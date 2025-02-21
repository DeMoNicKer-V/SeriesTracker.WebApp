using GraphQL;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Abstractions
{
    public interface IShikimoriService
    {
        Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimeById(string Id);

        Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimeListByIds(string Id);

        Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimes(int page, string order);

        Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimesByAllParams(int page, string name, string season, string status, string kind, string genre, string order, bool censored);

        Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimesByAllParamsAndIds(int page, string name, string ids, string season, string status, string kind, string genre, string order, bool censored);

        Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimesByName(string name);

        Task<GraphQLResponse<GenreList>> GetGenres();

        Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetRandomAnime();

        AnimeFullDto MapToFullDto(ShikimoriAnimeBase anime);

        AnimeShortDto MapToShortDto(ShikimoriAnimeBase anime);

        AnimeSeriesDto MapToAnimeSeriesDto(ShikimoriAnimeBase anime, int categoryId = 0, string categoryName = "", string categoryColor = "");

        object MapToAnimeSeriesFullDto(ShikimoriAnimeBase anime, SeriesCategoryDto? series, bool isFull);
    }
}