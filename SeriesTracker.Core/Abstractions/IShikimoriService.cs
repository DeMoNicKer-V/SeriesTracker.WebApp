using GraphQL;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Abstractions
{
    public interface IShikimoriService
    {
        Task<ShikimoriAnimeBaseList> GetAnimeById(string Id);

        Task<ShikimoriAnimeBaseList> GetAnimeListByIds(string Id);

        Task<ShikimoriAnimeBaseList> GetAnimesByAllParams(int page, string name, string season, string status, string kind, string genre, string order, bool censored);

        Task<ShikimoriAnimeBaseList> GetAnimesByName(string name);

        Task<GenreList> GetGenres();

        Task<ShikimoriAnimeBaseList> GetRandomAnime();

        AnimeFullDto MapToFullDto(ShikimoriAnimeBase anime);

        AnimeShortDto MapToShortDto(ShikimoriAnimeBase anime);

        AnimeSeriesDto MapToAnimeSeriesDto(ShikimoriAnimeBase anime, int categoryId = 0, string categoryName = "", string categoryColor = "");

        object MapToAnimeSeriesFullDto(ShikimoriAnimeBase anime, SeriesCategoryDto? series, bool isFull);
    }
}