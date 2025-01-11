using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Repositories
{
    public class SeriesRepository : ISeriesRepository
    {
        private readonly SeriesTrackerDbContext _context;

        public SeriesRepository(SeriesTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<List<Series>> GetSeriesList()
        {
            var seriesEntities = await _context.SeriesEntities.AsNoTracking().ToListAsync();

            var seiresList = seriesEntities.Select(s => Series.Create(s.Id, s.AnimeId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.CategoryId, s.IsFavorite).Series).ToList();

            return seiresList;
        }

        public async Task<Series> GetSeriesById(Guid id)
        {
            var s = await _context.SeriesEntities.AsNoTracking().Where(s => s.Id == id).FirstAsync();

            var seires = Series.Create(s.Id, s.AnimeId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.CategoryId, s.IsFavorite).Series;

            return seires;
        }

        public async Task<Guid> CreateSeries(Series series)
        {
            var seriesEntity = new SeriesEntity
            {
                Id = series.Id,
                AnimeId = series.AnimeId,
                WatchedEpisode = series.WatchedEpisode,
                AddedDate = series.AddedDate,
                ChangedDate = series.ChangedDate,
                CategoryId = series.CategoryId,
                IsFavorite = series.IsFavorite,
            };

            await _context.SeriesEntities.AddAsync(seriesEntity);
            await _context.SaveChangesAsync();

            return seriesEntity.Id;
        }

        public async Task<Guid> UpdateSeries(Guid id, int watched, string changed, int categoryId, bool favorite)
        {
            await _context.SeriesEntities.Where(s => s.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(s => s.WatchedEpisode, s => watched)
                .SetProperty(s => s.ChangedDate, s => changed)
                .SetProperty(s => s.CategoryId, s => categoryId)
                .SetProperty(s => s.IsFavorite, s => favorite));

            return id;
        }

        public async Task<Guid> DeleteSeries(Guid id)
        {
            await _context.SeriesEntities.Where(s => s.Id == id).ExecuteDeleteAsync();

            return id;
        }

        public async Task<int> GetAllSeriesCount()
        {
            return await _context.SeriesEntities.CountAsync();
        }


        public async Task<Guid> GetSeriesByAnimeId(int id) => await _context.SeriesEntities
        .Where(s => s.AnimeId == id)
        .Select(s => s.Id)
        .FirstOrDefaultAsync();
    }
}
