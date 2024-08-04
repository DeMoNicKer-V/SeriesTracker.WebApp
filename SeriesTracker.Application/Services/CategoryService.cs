using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryService _categoryRepository;

        public CategoryService(ICategoryService categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }
        public async Task<Guid> CreateCategory(Category category)
        {
            return await _categoryRepository.CreateCategory(category);
        }
        public async Task<Guid> DeleteCategory(Guid id)
        {
            return await _categoryRepository.DeleteCategory(id);
        }
        public async Task<List<Category>> GetCategoryList()
        {
            return await _categoryRepository.GetCategoryList();
        }
        public async Task<Category> GetCategoryById(Guid id)
        {
            return await _categoryRepository.GetCategoryById(id);
        }
        public async Task<Guid> UpdateCategory(Guid id, string title)
        {
            return await _categoryRepository.UpdateCategory(id, title);
        }
    }
}
