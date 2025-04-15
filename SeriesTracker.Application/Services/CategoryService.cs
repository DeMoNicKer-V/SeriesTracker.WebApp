using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Application.Services
{
    /// <summary>
    /// Сервис для работы с категориями аниме.
    /// Предоставляет методы для получения информации о категориях и обновления их цветов.
    /// </summary>
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="CategoryService"/>.
        /// </summary>
        /// <param name="categoryRepository">Репозиторий для работы с категориями.</param>
        public CategoryService(ICategoryRepository categoryRepository)
        {
            // Внедряем зависимость (Dependency Injection) репозитория категорий
            _categoryRepository = categoryRepository ?? throw new ArgumentNullException(nameof(categoryRepository));
        }

        public async Task<Category> GetCategoryById(int id)
        {
            // Получаем категорию из репозитория
            return await _categoryRepository.GetCategoryById(id);
        }

        public async Task<List<Category>> GetCategoryList()
        {
            // Получаем список категорий из репозитория
            return await _categoryRepository.GetCategoryList();
        }
        public async Task<bool> UpdateCategoryColor(int id, string color)
        {
            // Получаем текущую дату и время в формате UTC
            var dateNow = DateTime.UtcNow.ToString("");

            // Обновляем цвет категории в репозитории
            return await _categoryRepository.UpdateCategoryColor(id, color, dateNow);
        }
    }
}