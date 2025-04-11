using Microsoft.EntityFrameworkCore;
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
            var userSeriesEntity = new UserSeriesEntity
            {
                Id = model.Id,
                UserId = model.UserId,
                AnimeId = model.AnimeId,
                CategoryId = model.CategoryId,
                AddedDate = model.AddedDate,
                ChangedDate = model.ChangedDate,
                WatchedEpisodes = model.WatchedEpisodes,
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

        public async Task<SeriesProfileDTO> GetUserProfile(Guid Id)
        {
            var userSeriesList = await _context.UserSeriesEntities
                .AsNoTracking()
                .Where(s => s.UserId == Id)
                .Include(user => user.Category)
                .ToListAsync();

            if (userSeriesList.Count == 0)
            {
                return new SeriesProfileDTO();
            }

            var categoryGroup = userSeriesList
                .GroupBy(s => s.Category.Id)
                .Select(g =>
                {
                    var category = g.First().Category;

                    return new SeriesGroupDto
                    {
                        Id = g.Key,
                        Name = category.Name,
                        Color = category.Color,
                        SeriesCount = g.Count()
                    };
                })
                .ToList();

            var lastFiveSeriesString = string.Join(",", userSeriesList
                .OrderByDescending(s => s.ChangedDate)
                .Take(5)
                .Select(s => s.AnimeId)
                .ToList());

            var result = new SeriesProfileDTO
            {
                CategoryGroups = categoryGroup,
                LastFiveSeries = lastFiveSeriesString,
            };
            return result;
        }

        public async Task<List<SeriesGroupShortDto>> GetGroupShortSeries(string userName)
        {
            var userSeries = await _context.UserSeriesEntities
                .AsNoTracking()
                .Where(s => s.User.UserName == userName)
                .Include(s => s.Category)
                .ToListAsync();

            if (userSeries.Count == 0)
            {
                return [];
            }

            var categoryGroup = userSeries
                .GroupBy(s => new { s.Category.Id, s.Category.Name, s.Category.Color })
                .Select(g => new SeriesGroupShortDto
                {
                    Key = g.Key.Id.ToString(),
                    Value = g.Count(),
                    Color = g.Key.Color
                })
                .ToList();

            // Получаем количество (если есть данные)
            int count = userSeries.Count;

            // Создаем результат и вставляем в начало:
            var result = categoryGroup.ToList();

            result.Insert(0, new SeriesGroupShortDto { Key = "0", Value = count, Color = "" });

            return result;
        }

        public async Task<List<int>> GetAnimeIdsList(string userName, int page, int categoryId, bool isFavorite)
        {
            var animeIds = await _context.UserSeriesEntities
                .AsNoTracking()
                .Where(s => s.User.UserName == userName && (categoryId <= 0 || s.CategoryId == categoryId) && (!isFavorite || s.IsFavorite))
                .Skip((page - 1) * 22)
                .Take(22)
                .Select(s => s.AnimeId)
                .ToListAsync();

            return animeIds;
        }

        public async Task<Guid> UpdateSeries(Guid seriesId, int watched, int categoryId, bool favorite, string dateNow)
        {
            await _context.UserSeriesEntities.Where(s => s.Id == seriesId)
                .ExecuteUpdateAsync(s => s.SetProperty(s => s.WatchedEpisodes, s => watched)
                .SetProperty(s => s.CategoryId, s => categoryId)
                .SetProperty(s => s.IsFavorite, s => favorite)
                .SetProperty(s => s.ChangedDate, s => dateNow));

            return seriesId;
        }
    }
}