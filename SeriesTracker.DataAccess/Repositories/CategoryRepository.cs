using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;

namespace SeriesTracker.DataAccess.Repositories
{
    /// <summary>
    /// Репозиторий для работы с категориями в базе данных.
    /// Предоставляет методы для получения информации о категориях и их обновления.
    /// </summary>
    public class CategoryRepository : ICategoryRepository
    {
        private readonly SeriesTrackerDbContext _context;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="CategoryRepository"/>.
        /// </summary>
        /// <param name="context">Контекст базы данных SeriesTrackerDbContext для доступа к данным.</param>
        public CategoryRepository(SeriesTrackerDbContext context)
        {
            // Внедряем зависимость (Dependency Injection) контекста базы данных и проверяем на null
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Category> GetCategoryById(int categoryId)
        {
            // Получаем категории по Id
            // AsNoTracking используется, так как мы не планируем изменять эту сущность.
            var category = await _context.CategoryEntities
                .AsNoTracking()
                .Where(c => c.Id == categoryId)
                .Select(c => Category.Create(c.Id, c.Name, c.Color, c.PrevColor, c.Date)) // Преобразуем CategoryEntity в Category
                .SingleAsync();

            return category; // Возвращаем категорию
        }

        public async Task<List<Category>> GetCategoryList()
        {
            // Получаем список категорий из базы данных
            // AsNoTracking используется, так как мы не планируем изменять список сущностей.
            var categories = await _context.CategoryEntities
                .AsNoTracking()
                .Select(c => Category.Create(c.Id, c.Name, c.Color, c.PrevColor, c.Date)) // Преобразуем CategoryEntity в Category
                .ToListAsync();

            return categories; // Возвращаем список категорий
        }

        public async Task<bool> UpdateCategoryColor(Category category)
        {
            // 1. Получаем CategoryEntity из базы данных по ID категории
            var categoryEntity = await _context.CategoryEntities.FindAsync(category.Id);

            if (categoryEntity == null)
            {
                return false; // Если категория не найдена
            }

            // 2. Обновляем CategoryEntity данными из Model Category
            categoryEntity.Color = category.Color;
            categoryEntity.PrevColor = category.PrevColor;
            categoryEntity.Date = category.Date;

            // 3. Сохраняем изменения в базе данных
            var rowsAffected = await _context.SaveChangesAsync();

            return rowsAffected > 0; // Возвращаем true, если кол-во затронутых записей больше нуля, иначе - false
        }
    }
}