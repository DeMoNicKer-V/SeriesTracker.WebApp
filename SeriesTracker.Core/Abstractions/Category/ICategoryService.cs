using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    /// <summary>
    /// Интерфейс для сервиса, предоставляющего доступ к категориям.
    /// </summary>
    public interface ICategoryService
    {
        /// <summary>
        /// Получает список всех категорий.
        /// </summary>
        /// <returns>Список всех категорий.</returns>
        Task<List<Category>> GetCategoryList();

        /// <summary>
        /// Получает категорию по ее идентификатору.
        /// </summary>
        /// <param name="categoryId">Идентификатор категории.</param>
        /// <returns>Категория с указанным идентификатором.</returns>
        Task<Category> GetCategoryById(int categoryId);

        /// <summary>
        /// Обновляет цвет категории.
        /// </summary>
        /// <param name="categoryId">Идентификатор категории.</param>
        /// <param name="color">Новый цвет категории.</param>
        /// <returns><see langword="true"/>, если данные обновлены, иначе - <see langword="false"/></returns>
        Task<bool> UpdateCategoryColor(int categoryId, string color);
    }
}