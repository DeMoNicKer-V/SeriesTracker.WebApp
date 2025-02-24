using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Repositories
{
    public class UserSeriesRepository : IUserSeriesRepository
    {
        private readonly SeriesTrackerDbContext _context;

        public UserSeriesRepository(SeriesTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> CreateAsync(UserSeries model)
        {
            var categoryEntity = await _context.CategoryEntities
    .SingleOrDefaultAsync(r => r.Id == (int)model.CategoryId)
    ?? throw new InvalidOperationException();

            var userSeriesEntity = new UserSeriesEntity
            {
                Id = model.Id,
                AnimeId = model.AnimeId,
                UserId = model.UserId,
                CategoryId = model.CategoryId,
                Category = categoryEntity,
                AddedDate = model.AddedDate,
                ChangedDate = model.ChangedDate,
                WatchedEpisode = model.WatchedEpisode,
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

        public async Task<string> GetRecentSeriesString(Guid userId)
        {
            var userSeriesList = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.UserId == userId).OrderByDescending(s => s.ChangedDate).Take(5).Select(s => s.AnimeId).ToListAsync();
            return userSeriesList.Any()
         ? string.Join(",", userSeriesList)
         : "";
        }

        public async Task<List<SeriesGroupShortDto>> GetGroupShortSeries(Guid id)
        {
            var userSeriesList = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.UserId == id).Include(user => user.Category).ToListAsync();

            var categoryGroup = userSeriesList
     .GroupBy(s => s.Category)
     .Select(g => new SeriesGroupShortDto
     {
         Key = g.Key?.Id.ToString() ?? default(int).ToString(), // Обращаемся к Id через Category, делая null-safe
         Value = g.Count()
     })
     .ToList();
            categoryGroup.Insert(0, new SeriesGroupShortDto { Key = 0.ToString(), Value = userSeriesList.Count });
            return categoryGroup;
        }

        public async Task<List<SeriesGroupDto>> GetGroupSeries(Guid id)
        {
            var userSeriesList = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.UserId == id).Include(user => user.Category).ToListAsync();

            var categoryGroup = userSeriesList
     .GroupBy(s => s.Category)
     .Select(g => new SeriesGroupDto
     {
         Id = g.Key?.Id ?? default(int), // Обращаемся к Id через Category, делая null-safe
         Name = g.Key?.Name ?? "", //Обработка null
         Color = g.Key?.Color ?? "", //Обработка null
         SeriesCount = g.Count(),
     })
     .ToList();

            return categoryGroup;
        }
        public async Task<List<int>> GetSeriesAnimeIdsList(string username, int categoryId)
        {
            List<int> seriesAnimeIdsList = new List<int>();
            if (string.IsNullOrEmpty(username) == false)
            {
                var user = await _context.UserEntities.AsNoTracking().Where(u => u.UserName == username).FirstAsync();
                seriesAnimeIdsList = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.UserId == user.Id && categoryId != 0 ? s.CategoryId == categoryId : true).Select(s => s.AnimeId).ToListAsync();
            }
            else
            {
                return [];
            }

            return seriesAnimeIdsList;
        }

        public async Task<UserSeries?> GetSeriesByAnimeIdAsync(int id, string username)
        {
            var s = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.AnimeId == id && s.User.UserName == username).FirstOrDefaultAsync();
            if (s == null)
            {
                return null;
            }

            var userSeries = UserSeries.Create(s.Id, s.AnimeId, s.UserId, s.CategoryId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.IsFavorite).UserSeries;

            return userSeries;
        }

        public async Task<UserSeries> GetSeriesById(Guid id)
        {
            var s = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.Id == id).FirstAsync();

            var userSeries = UserSeries.Create(s.Id, s.AnimeId, s.UserId, s.CategoryId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.IsFavorite).UserSeries;

            return userSeries;
        }
        public async Task<List<UserSeries>> GetSeriesList(string id)
        {
            List<UserSeriesEntity> userSeriesEntities = new List<UserSeriesEntity>();
            if (string.IsNullOrEmpty(id) == false)
            {
                var guid = Guid.Parse(id);
                userSeriesEntities = await _context.UserSeriesEntities.AsNoTracking().Where(s => s.UserId == guid).ToListAsync();
            }
            else
            {
                return [];
            }

            var seriesList = userSeriesEntities.Select(s => UserSeries.Create(s.Id, s.AnimeId, s.UserId, s.CategoryId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.IsFavorite).UserSeries).ToList();

            return seriesList;
        }

        public async Task<Guid> UpdateSeries(Guid id, int watched, string changed, int categoryId, bool favorite)
        {
            await _context.UserSeriesEntities.Where(s => s.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(s => s.WatchedEpisode, s => watched)
                .SetProperty(s => s.ChangedDate, s => changed)
                .SetProperty(s => s.CategoryId, s => categoryId)
                .SetProperty(s => s.IsFavorite, s => favorite));

            return id;
        }
    }
}