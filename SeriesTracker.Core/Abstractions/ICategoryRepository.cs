using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    public interface ICategoryRepository
    {
        Task<int> CreateCategory(Category category);
        Task<int> DeleteCategory(int id);
        Task<List<Category>> GetCategoryList();
        Task<Category> GetCategoryById(int id);
        Task<int> UpdateCategoryColor(int id, string color, DateTime date);
    }
}
