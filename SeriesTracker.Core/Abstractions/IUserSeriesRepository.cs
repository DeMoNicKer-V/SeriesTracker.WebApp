using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    public interface IUserSeriesRepository
    {
        Task<Guid> AddAsync(UserSeries model);
        Task<Guid> DeleteSeries(Guid id);
        Task<Guid> DeleteAllSeriesByUserId(Guid userId);
        Task<List<SeriesGroupDto>> GetGroupSeries(Guid id);
        Task<List<SeriesGroupShortDto>> GetGroupShortSeries(string userName);
        Task<string> GetRecentSeriesString(Guid userId);
        Task<Guid> UpdateSeries(Guid seriesId, int watched, int categoryId, bool favorite, string dateNow);
        Task<List<int>> GetAnimeIdsList(string userName, int page, int categoryId, bool isFavorite);
    }
}
