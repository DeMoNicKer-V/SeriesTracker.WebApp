using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    /// <summary>
    /// Интерфейс для репозитория, предоставляющего доступ к данным о категориях.
    /// </summary>
    public interface ICategoryRepository
    {
        /// <summary>
        /// Получает список всех категорий.
        /// </summary>
        /// <returns>Список всех категорий.</returns>
        Task<List<Category>> GetCategoryList();

        /// <summary>
        /// Получает категорию по ее идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор категории.</param>
        /// <returns>Категория с указанным идентификатором.</returns>
        Task<Category> GetCategoryById(int id);

        /// <summary>
        /// Обновляет цвет категории.
        /// </summary>
        /// <param name="category">Категория, цвет которой нужно изменить.</param>
        /// <param name="color">Новый цвет категории.</param>
        /// <param name="dateNow">Дата и время обновления.</param>
        /// <returns><see langword="true"/>, если данные обновлены, иначе - <see langword="false"/></returns>
        Task<bool> UpdateCategoryColor(Category category);
    }
}