using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions
{
    public interface ICategoryService
    {
        Task<int> CreateCategory(Category category);
        Task<int> DeleteCategory(int id);
        Task<List<Category>> GetCategoryList();
        Task<Category> GetCategoryById(int id);
        Task<int> UpdateCategory(int id, string title, string color, string date);
    }
}
