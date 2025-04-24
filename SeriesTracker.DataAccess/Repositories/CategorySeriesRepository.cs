using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos;

namespace SeriesTracker.DataAccess.Repositories
{
    /// <summary>
    /// Репозиторий для работы со связями между категориями и пользоватескими списками аниме.
    /// Предоставляет методы для получения информации о категориях пользоватеских аниме.
    /// </summary>
    public class CategorySeriesRepository : ICategorySeriesRepository
    {
        private readonly SeriesTrackerDbContext _context;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="CategorySeriesRepository"/>.
        /// </summary>
        /// <param name="context">Контекст базы данных SeriesTrackerDbContext для доступа к данным.</param>
        public CategorySeriesRepository(SeriesTrackerDbContext context)
        {
            // Внедряем зависимость (Dependency Injection) контекста базы данных и проверяем на null
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Dictionary<int, SeriesCategoryDto>> GetSeriesAnimeId(Guid userId, List<int> animeIds)
        {
            // Получаем список SeriesCategoryDto
            // AsNoTracking используется, так как мы не планируем изменять этот объект.
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

            return seriesCategoriesDictionary; // Возвращаем словарь
        }
    }
}