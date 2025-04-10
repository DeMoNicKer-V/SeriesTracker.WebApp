﻿using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Dtos.User;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Abstractions
{
    public interface IUserSeriesService
    {
        Task<Guid> CreateAsync(Guid seriesDd, Guid userId, int animeId, int categoryId, int watchedEpisodes, bool isFavorite);
        Task<Guid> DeleteSeries(Guid id);
        Task<Guid> DeleteAllSeriesByUserId(Guid userId);
        Task<Guid> UpdateSeries(Guid seriesId, int watched, int categoryId, bool favorite);
        Task<List<SeriesGroupShortDto>> GetGroupShortSeries(string userName);
        Task<ShikimoriAnimeBase[]> GetUserSeriesList(string userName, int page, int categoryId, bool isFavorite);
        Task<UserActivityDTO?> GetUserProfile(string userName);
    }
}
