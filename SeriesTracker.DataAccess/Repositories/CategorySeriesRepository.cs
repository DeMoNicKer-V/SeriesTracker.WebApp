using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Mappers;
using SeriesTracker.Core.Models;


namespace SeriesTracker.DataAccess.Repositories
{
    public class CategorySeriesRepository : ICategorySeriesRepository
    {
        private readonly IDbContextFactory<SeriesTrackerDbContext> _contextFactory;

        public CategorySeriesRepository(IDbContextFactory<SeriesTrackerDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }
        public async Task<Category?> GetCategoryBySeriesAnimeId(Guid userId, int animeId)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var s = await context.UserSeriesEntities
               .AsNoTracking()
              .Include(c => c.Category)
             .AsSplitQuery()
             .Where(s => s.AnimeId == animeId && s.UserId == userId)
             .FirstOrDefaultAsync();

                if (s == null)
                {
                    return null;
                }
                var category = Category.Create(s.Category.Id, s.Category.Name, s.Category.Color, s.Category.PrevColor, s.Category.Date).Category;
                return category;
            }
        }

        public async Task<SeriesCategoryDto?> GetSeriesAnimeId(string username, int animeId)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var s = await context.UserSeriesEntities
               .AsNoTracking()
              .Include(c => c.Category)
             .AsSplitQuery()
             .Where(s => s.AnimeId == animeId && s.User.UserName == username)
             .FirstOrDefaultAsync();

                if (s == null)
                {
                    return null;
                }
                var category = Category.Create(s.Category.Id, s.Category.Name, s.Category.Color, s.Category.PrevColor, s.Category.Date).Category;
                var userSeries = UserSeries.Create(s.Id, s.AnimeId, s.UserId, s.CategoryId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.IsFavorite).UserSeries;
                return userSeries.ToSeriesCategoryDTO(category);
            }
        }
    }
}
