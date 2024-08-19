﻿using Microsoft.EntityFrameworkCore;
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

        public async Task<int> CreateCategory(Category category)
        {
            var categoryEntity = new CategoryEntity
            {
                Id = category.Id,
                Title = category.Title,
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

            var category = Category.Create(categoryEntity.Id, categoryEntity.Title, categoryEntity.Color, categoryEntity.PrevColor, categoryEntity.Date).Category;

            return category;
        }

        public async Task<List<Category>> GetCategoryList()
        {
            var categoryEntities = await _context.CategoryEntities.AsNoTracking().ToListAsync();

            var categoryList = categoryEntities.Select(c => Category.Create(c.Id, c.Title, c.Color, c.PrevColor, c.Date).Category).OrderBy(c => c.Id).ToList();

            return categoryList;
        }
        public async Task<int> UpdateCategory(int id, string title, string color, string date)
        {
            await _context.CategoryEntities.Where(c => c.Id == id)
               .ExecuteUpdateAsync(c => c.SetProperty(c => c.Title, c => title).SetProperty(c => c.Color, c => color).SetProperty(c => c.PrevColor, c => c.Color).SetProperty(c => c.Date, c=> date));
            return id;
        }
    }
}