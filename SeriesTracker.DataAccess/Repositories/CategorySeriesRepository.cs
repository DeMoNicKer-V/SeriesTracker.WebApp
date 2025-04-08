using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;

using SeriesTracker.Core.Models;

namespace SeriesTracker.DataAccess.Repositories
{
    public class CategorySeriesRepository(IDbContextFactory<SeriesTrackerDbContext> contextFactory, IMapper mapper) : ICategorySeriesRepository
    {
        private readonly IDbContextFactory<SeriesTrackerDbContext> _contextFactory = contextFactory;
        private readonly IMapper _mapper = mapper;

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

        public async Task<SeriesCategoryDto?> GetSeriesAnimeId(Guid userId, int animeId)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var s = await context.UserSeriesEntities
                .AsNoTracking()
                .Where(s => s.User.Id == userId && s.AnimeId == animeId)
                .Include(s => s.Category)
                .FirstOrDefaultAsync();

                if (s == null)
                {
                    return null;
                }

                var userSeries = new UserSeries(s.Id, s.AnimeId, s.UserId, s.CategoryId, s.WatchedEpisodes, s.AddedDate, s.ChangedDate, s.IsFavorite);
                var result = _mapper.Map<SeriesCategoryDto>(userSeries, opt =>
                {
                    opt.Items["CategoryId"] = s.Category.Id;
                    opt.Items["CategoryName"] = s.Category.Name;
                    opt.Items["CategoryColor"] = s.Category.Color;
                });
                return result;
            }
        }
    }
}