using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Abstractions
{
    public interface IShikimoriService
    {
        Task<ShikimoriAnimeBaseList> GetAnimeById(string Id);

        Task<ShikimoriAnimeBaseList> GetAnimeListByIds(string Id);

        Task<AnimeSeriesDto[]> GetAnimesByAllParams(Guid userId, int page, string name, string season, string status, string kind, string genre, string order, bool censored);

        Task<ShikimoriAnimeBaseList> GetAnimesByName(string name);

        Task<GenreList> GetGenres();

        Task<ShikimoriAnimeBaseList> GetRandomAnime();
    }
}