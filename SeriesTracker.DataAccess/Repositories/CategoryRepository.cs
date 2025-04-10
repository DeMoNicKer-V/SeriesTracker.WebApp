﻿using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Repositories
{
    public class CategoryRepository(SeriesTrackerDbContext context) : ICategoryRepository
    {
        private readonly SeriesTrackerDbContext _context = context;

        public async Task<int> CreateCategory(Category category)
        {
            var categoryEntity = new CategoryEntity
            {
                Id = category.Id,
                Name = category.Name,
                Color = category.Color,
                PrevColor = category.PrevColor,
                Date = category.Date
            };

            await _context.CategoryEntities.AddAsync(categoryEntity);
            await _context.SaveChangesAsync();

            return categoryEntity.Id;
        }

        public async Task<int> DeleteCategory(int id)
        {
            await _context.CategoryEntities.Where(c => c.Id == id).ExecuteDeleteAsync();

            return id;
        }

        public async Task<Category> GetCategoryById(int id)
        {
            var categoryEntity = await _context.CategoryEntities.AsNoTracking().Where(c => c.Id == id).FirstAsync();

            var category = Category.Create(categoryEntity.Id, categoryEntity.Name, categoryEntity.Color, categoryEntity.PrevColor, categoryEntity.Date);

            return category;
        }

        public async Task<List<Category>> GetCategoryList()
        {
            var categoryEntities = await _context.CategoryEntities.AsNoTracking().ToListAsync();

            var categoryList = categoryEntities.Select(c => Category.Create(c.Id, c.Name, c.Color, c.PrevColor, c.Date)).OrderBy(c => c.Id).ToList();

            return categoryList;
        }

        public async Task<int> UpdateCategoryColor(int id, string color, string dateNow)
        {
            await _context.CategoryEntities.Where(c => c.Id == id)
               .ExecuteUpdateAsync(c => c.SetProperty(c => c.Color, c => color)
                                          .SetProperty(c => c.PrevColor, c => c.Color)
                                          .SetProperty(c => c.Date, c => dateNow));
            return id;
        }
    }
}