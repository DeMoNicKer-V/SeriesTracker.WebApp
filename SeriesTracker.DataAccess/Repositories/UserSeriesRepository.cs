﻿using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Repositories
{
    public class UserSeriesRepository(SeriesTrackerDbContext context) : IUserSeriesRepository
    {
        private readonly SeriesTrackerDbContext _context = context;

        public async Task<Guid> AddAsync(UserSeries model)
        {
            var categoryEntity = await _context.CategoryEntities
                .SingleOrDefaultAsync(r => r.Id == model.CategoryId) ?? throw new KeyNotFoundException($"Category with ID {model.CategoryId} not found.");

            var userSeriesEntity = new UserSeriesEntity
            {
                Id = model.Id,
                UserId = model.UserId,
                AnimeId = model.AnimeId,
                CategoryId = model.CategoryId,
                Category = categoryEntity,
                AddedDate = model.AddedDate,
                ChangedDate = model.ChangedDate,
                WatchedEpisode = model.WatchedEpisodes,
                IsFavorite = model.IsFavorite,
            };

            await _context.UserSeriesEntities.AddAsync(userSeriesEntity);
            await _context.SaveChangesAsync();

            return userSeriesEntity.Id;
        }

        public async Task<Guid> DeleteAllSeriesByUserId(Guid userId)
        {
            await _context.UserSeriesEntities.Where(s => s.UserId == userId).ExecuteDeleteAsync();

            return userId;
        }

        public async Task<Guid> DeleteSeries(Guid id)
        {
            await _context.UserSeriesEntities.Where(s => s.Id == id).ExecuteDeleteAsync();

            return id;
        }

        public async Task<int> GetAllSeriesCount()
        {
            return await _context.UserSeriesEntities.CountAsync();
        }

        public async Task<List<SeriesGroupDto>> GetGroupSeries(Guid id)
        {
            var userSeriesList = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.UserId == id).Include(user => user.Category).ToListAsync();

            var categoryGroup = userSeriesList
                .GroupBy(s => s.Category?.Id)
                .Select(g =>
                {
                    var category = g.FirstOrDefault(x => x.Category?.Id == g.Key)?.Category;

                    return new SeriesGroupDto
                    {
                        Id = g.Key ?? default,
                        Name = category?.Name ?? string.Empty,
                        Color = category?.Color ?? string.Empty,
                        SeriesCount = g.Count()
                    };
                })
                .ToList();

            return categoryGroup;
        }

        public async Task<List<SeriesGroupShortDto>> GetGroupShortSeries(Guid id)
        {
            var userSeriesList = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.UserId == id).Include(user => user.Category).ToListAsync();

            var categoryGroup = userSeriesList.GroupBy(s => s.Category)
                .Select(g => new SeriesGroupShortDto
                {
                    Key = g.Key?.Id.ToString() ?? default(int).ToString(),
                    Value = g.Count()
                }).ToList();
           
            categoryGroup.Insert(0, new SeriesGroupShortDto { Key = 0.ToString(), Value = userSeriesList.Count });

            return categoryGroup;
        }

        public async Task<string> GetRecentSeriesString(Guid userId)
        {
            var userSeriesList = await _context.UserSeriesEntities.AsNoTracking()
                .Where(s => s.UserId == userId).OrderByDescending(s => s.ChangedDate)
                .Take(5).Select(s => s.AnimeId).ToListAsync();

            return userSeriesList.Count > 0 ? string.Join(",", userSeriesList) : string.Empty;
        }

        public async Task<List<int>> GetSeriesAnimeIdsList(string userName, int categoryId)
        {
            List<int> seriesAnimeIdsList = [];

            if (!string.IsNullOrEmpty(userName))
            {
                var user = await _context.UserEntities.AsNoTracking().Where(u => u.UserName == userName).FirstAsync();

                seriesAnimeIdsList = await _context.UserSeriesEntities.AsNoTracking()
                    .Where(s => categoryId > 0 ? s.UserId == user.Id && s.CategoryId == categoryId: s.UserId == user.Id)
                    .Select(s => s.AnimeId).ToListAsync();
            }
            else
            {
                return [];
            }

            return seriesAnimeIdsList;
        }

        public async Task<UserSeries?> GetSeriesByAnimeIdAsync(int id, string userName)
        {
            var s = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.AnimeId == id && s.User.UserName == userName).FirstOrDefaultAsync();
            if (s == null)
            {
                return null;
            }

            var userSeries = new UserSeries(s.Id, s.AnimeId, s.UserId, s.CategoryId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.IsFavorite);

            return userSeries;
        }

        public async Task<UserSeries> GetSeriesById(Guid id)
        {
            var s = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.Id == id).FirstAsync();
            var userSeries = new UserSeries(s.Id, s.AnimeId, s.UserId, s.CategoryId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.IsFavorite);

            return userSeries;
        }

        public async Task<List<UserSeries>> GetSeriesList(string id)
        {
            List<UserSeriesEntity> userSeriesEntities = [];
            if (string.IsNullOrEmpty(id) == false)
            {
                var guid = Guid.Parse(id);
                userSeriesEntities = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.UserId == guid).ToListAsync();
            }
            else
            {
                return [];
            }

            var seriesList = userSeriesEntities.Select(s => new UserSeries(s.Id, s.AnimeId, s.UserId, s.CategoryId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.IsFavorite)).ToList();
            
            return seriesList;
        }

        public async Task<Guid> UpdateSeries(Guid seriesId, int watched, int categoryId, bool favorite, string dateNow)
        {
            await _context.UserSeriesEntities.Where(s => s.Id == seriesId)
                .ExecuteUpdateAsync(s => s.SetProperty(s => s.WatchedEpisode, s => watched)
                .SetProperty(s => s.CategoryId, s => categoryId)
                .SetProperty(s => s.IsFavorite, s => favorite)
                .SetProperty(s => s.ChangedDate, s => dateNow));

            return seriesId;
        }
    }
}