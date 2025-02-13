using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess;
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

        private readonly IDbContextFactory<SeriesTrackerDbContext> _contextFactory;
        public CategorySeriesService(IDbContextFactory<SeriesTrackerDbContext> contextFactory, ICategorySeriesRepository categorySeriesRepository)
        {
            _contextFactory = contextFactory;
            _categorySeriesRepository = categorySeriesRepository;
        }
        public async Task<Category?> GetCategoryBySeriesAnimeId(Guid userId, int animeId)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var seriesCategory = await _categorySeriesRepository.GetCategoryBySeriesAnimeId(userId, animeId);

                return seriesCategory;
            }
        }

        public async Task<SeriesCategoryDto?> GetSeriesAnimeId(Guid userId, int animeId)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var seriesCategory = await _categorySeriesRepository.GetSeriesAnimeId(userId, animeId);

                return seriesCategory;
            }
        }
    }
}
