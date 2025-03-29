using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Abstractions
{
    public interface IUserSeriesService
    {
        Task<Guid> CreateAsync(Guid seriesDd, Guid userId, int animeId, int categoryId, int watchedEpisodes, bool isFavorite);
        Task<Guid> DeleteSeries(Guid id);
        Task<Guid> DeleteAllSeriesByUserId(Guid userId);
        Task<Guid> UpdateSeries(Guid seriesId, int watched, int categoryId, bool favorite);
        Task<List<SeriesGroupDto>> GetGroupSeries(Guid userId);
        Task<List<SeriesGroupShortDto>> GetGroupShortSeries(string userName);
        Task<string> GetRecentSeriesString(Guid userId);
        Task<IEnumerable<ShikimoriAnimeBase>> GetAnimeIdsString(string userName, int page, int categoryId, bool isFavorite);
    }
}
