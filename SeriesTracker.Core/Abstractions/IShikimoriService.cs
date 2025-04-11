using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Abstractions
{
    public interface IShikimoriService
    {
        Task<AnimeSeriesFullDto> GetAnimeById(Guid userId, string animeId);

        Task<AnimeSeriesFullDto[]> GetAnimeListByIds(string userName, string Ids);

        Task<AnimeSeriesDto[]> GetAnimesByAllParams(Guid userId, int page, string name, string season, string status, string kind, string genre, string order, bool censored);

        Task<AnimeSeriesDto[]> GetAnimesByName(Guid userId, string animeName);

        Task<GenreList> GetGenres();

        Task<ShikimoriAnimeBaseList> GetRandomAnime();
    }
}