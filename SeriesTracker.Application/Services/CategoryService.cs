using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }
        public async Task<int> CreateCategory(Category category)
        {
            return await _categoryRepository.CreateCategory(category);
        }
        public async Task<int> DeleteCategory(int id)
        {
            return await _categoryRepository.DeleteCategory(id);
        }
        public async Task<List<Category>> GetCategoryList()
        {
            return await _categoryRepository.GetCategoryList();
        }
        public async Task<Category> GetCategoryById(int id)
        {
            return await _categoryRepository.GetCategoryById(id);
        }

        public async Task<int> UpdateCategoryColor(int id, string color, DateTime date)
        {
            return await _categoryRepository.UpdateCategoryColor(id, color, date);
        }
    }
}
