using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    public interface IUserSeriesService
    {
        Task<Guid> CreateAsync(UserSeries model);
        Task<Guid> DeleteSeries(Guid id);
        Task<Guid> DeleteAllSeriesByUserId(Guid userId);
        Task<int> GetAllSeriesCount();
        Task<UserSeries?> GetSeriesByAnimeIdAsync(int id, string userName);
        Task<UserSeries> GetSeriesById(Guid id);
        Task<List<UserSeries>> GetSeriesList(string id);
        Task<Guid> UpdateSeries(Guid id, int watched, string changed, int categoryId, bool favorite);
        Task<List<SeriesGroupDto>> GetGroupSeries(Guid userId);
        Task<List<SeriesGroupShortDto>> GetGroupShortSeries(Guid id);
        Task<string> GetRecentSeriesString(Guid userId);
        Task<string> GetSeriesAnimeIdsList(string userName, int categoryId);
        Task<Category?> GetCategoryByAnimeSeries(int id, string userName);
    }
}
