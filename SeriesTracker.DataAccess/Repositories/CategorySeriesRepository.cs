using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;


namespace SeriesTracker.DataAccess.Repositories
{
    public class CategorySeriesRepository : ICategorySeriesRepository
    {
        private readonly SeriesTrackerDbContext _context;

        public CategorySeriesRepository(SeriesTrackerDbContext context)
        {
            _context = context;
        }
        public async Task<Category> GetCategoryBySeriesAnimeId(Guid userId, int animeId)
        {
            var s = await _context.UserSeriesEntities.AsNoTracking().Include(u => u.Category).Where(s => s.UserId == userId &&  s.AnimeId == animeId).FirstAsync();

            var category = Category.Create(s.Category.Id, s.Category.Name, s.Category.Color, s.Category.PrevColor, s.Category.Date).Category;
            return category;
        }
    }
}
