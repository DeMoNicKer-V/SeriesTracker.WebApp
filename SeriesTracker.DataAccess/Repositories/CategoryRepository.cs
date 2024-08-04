using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace SeriesTracker.DataAccess.Repositories
{

    public class CategoryRepository : ICategoryRepository
    {
        private readonly SeriesTrackerDbContext _context;

        public CategoryRepository(SeriesTrackerDbContext context)
        {
            _context = context;
        }
        public async Task<Guid> CreateCategory(Category category)
        {
            var categoryEntity = new CategoryEntity
            {
                Id = category.Id,
                Title = category.Title,
            };

            await _context.CategoryEntities.AddAsync(categoryEntity);
            await _context.SaveChangesAsync();

            return categoryEntity.Id;
        }
        public async Task<Guid> DeleteCategory(Guid id)
        {
            await _context.CategoryEntities.Where(c => c.Id == id).ExecuteDeleteAsync();

            return id;
        }
        public async Task<List<Category>> GetCategoryList()
        {
            var categoryEntities = await _context.CategoryEntities.AsNoTracking().ToListAsync();

            var categoryList = categoryEntities.Select(c => Category.Create(c.Id, c.Title).Category).ToList();

            return categoryList;
        }
        public async Task<Category> GetCategoryById(Guid id)
        {
            var categoryEntity = await _context.CategoryEntities.AsNoTracking().Where(c => c.Id == id).FirstAsync();

            var category = Category.Create(categoryEntity.Id, categoryEntity.Title).Category;

            return category;
        }
        public async Task<Guid> UpdateCategory(Guid id, string title)
        {
            await _context.CategoryEntities.Where(c => c.Id == id)
               .ExecuteUpdateAsync(c => c.SetProperty(c => c.Title, c => title));
            return id;
        }
    }
}
