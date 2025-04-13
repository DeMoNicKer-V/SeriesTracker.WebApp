using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;

namespace SeriesTracker.DataAccess.Repositories
{
    public class CategorySeriesRepository : ICategorySeriesRepository
    {
        private readonly SeriesTrackerDbContext _context;

        public CategorySeriesRepository(SeriesTrackerDbContext context)
        {
            // Внедряем зависимость (Dependency Injection) контекста базы данных и проверяем на null
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Dictionary<int, SeriesCategoryDto>> GetSeriesAnimeId(Guid userId, List<int> animeIds)
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

            // Преобразуем список SeriesCategoryDto в словарь, где ключ - AnimeId
            var seriesCategoriesDictionary = seriesCategories.ToDictionary(c => c.AnimeId, c => c);

            return seriesCategoriesDictionary;
        }
    }
}