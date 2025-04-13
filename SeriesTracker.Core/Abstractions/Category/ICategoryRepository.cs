using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    /// <summary>
    /// Интерфейс для репозитория, предоставляющего доступ к данным о категориях
    /// </summary>
    public interface ICategoryRepository
    {
        Task<int> CreateCategory(Category category);
        Task<int> DeleteCategory(int id);
        Task<List<Category>> GetCategoryList();
        Task<Category> GetCategoryById(int id);
        Task<int> UpdateCategoryColor(int id, string color, string dateNow);
    }
}
