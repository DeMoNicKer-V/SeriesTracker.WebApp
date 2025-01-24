using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Application.Services
{
    public class CategorySeriesService : ICategorySeriesService
    {
        private readonly ICategorySeriesRepository _categorySeriesRepository;

        public CategorySeriesService(ICategorySeriesRepository categorySeriesRepository)
        {
            _categorySeriesRepository = categorySeriesRepository;
        }
        public async Task<Category> GetCategoryBySeriesAnimeId(Guid userId, int animeId)
        {
           return await _categorySeriesRepository.GetCategoryBySeriesAnimeId(userId, animeId);
        }
    }
}
