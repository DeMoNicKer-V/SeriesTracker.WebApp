using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;

using SeriesTracker.Core.Models;

namespace SeriesTracker.DataAccess.Repositories
{
    public class CategorySeriesRepository(IDbContextFactory<SeriesTrackerDbContext> contextFactory, SeriesTrackerDbContext context, IMapper mapper) : ICategorySeriesRepository
    {
        private readonly IDbContextFactory<SeriesTrackerDbContext> _contextFactory = contextFactory;
        private readonly SeriesTrackerDbContext _context = context;

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
                var category = Category.Create(s.Category.Id, s.Category.Name, s.Category.Color, s.Category.PrevColor, s.Category.Date);
                return category;
            }
        }

        public async Task<List<SeriesCategoryDto>> GetSeriesAnimeId(Guid userId, List<int> animeIds)
        {
            var seriesCategories = await _context.UserSeriesEntities
            .AsNoTracking()
            .Where(s => s.User.Id == userId && animeIds.Contains(s.AnimeId))
            .Include(s => s.Category)
            .Select(s => new SeriesCategoryDto
            {
                SeriesId = s.Id,
                AnimeId = s.AnimeId,
                CategoryId = s.CategoryId,
                CategoryName = s.Category.Name,
                CategoryColor = s.Category.Color,
                WatchedEpisodes = s.WatchedEpisodes,
                AddedDate = s.AddedDate,
                ChangedDate = s.ChangedDate,
                IsFavorite = s.IsFavorite
            })
            .ToListAsync();

            return seriesCategories;
        }
    }
}