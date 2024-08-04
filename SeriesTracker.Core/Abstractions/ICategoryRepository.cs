using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions
{
    public interface ICategoryRepository
    {
        Task<Guid> CreateCategory(Category category);
        Task<Guid> DeleteCategory(Guid id);
        Task<List<Category>> GetCategoryList();
        Task<Category> GetCategoryById(Guid id);
        Task<Guid> UpdateCategory(Guid id, string title);
    }
}
