using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Abstractions;
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

            var seiresList = seriesEntities.Select(s => Series.Create(s.Id, s.Title, s.Description, s.WatchedEpisode, s.LastEpisode, s.Duration,
                s.Rating, s.ImagePath, s.ReleaseDate, s.AddedDate, s.OverDate, s.ChangedDate, s.IsOver, s.IsFavorite).Series).ToList();

            return seiresList;
        }

        public async Task<Guid> CreateSeries(Series series)
        {
            var seriesEntity = new SeriesEntity
            {
                Id = series.Id,
                Title = series.Title,
                Description = series.Description,
                WatchedEpisode = series.WatchedEpisode,
                LastEpisode = series.LastEpisode,
                Duration = series.Duration,
                Rating = series.Rating,
                ImagePath = series.ImagePath,
                ReleaseDate = series.ReleaseDate,
                AddedDate = series.AddedDate,
                OverDate = series.OverDate,
                ChangedDate = series.ChangedDate,
                IsOver = series.IsOver,
                IsFavorite = series.IsFavorite,
            };

            await _context.SeriesEntities.AddAsync(seriesEntity);
            await _context.SaveChangesAsync();

            return seriesEntity.Id;
        }

        public async Task<Guid> UpdateSeries(Guid id, string title, string description, int watched, int last, int duration,
            float rating, string image, string release, string changed, string overDate, bool over, bool favorite)
        {
            await _context.SeriesEntities.Where(s => s.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(s => s.Title, s => title)
                .SetProperty(s => s.Description, s => description)
                .SetProperty(s => s.WatchedEpisode, s => watched)
                .SetProperty(s => s.LastEpisode, s => last)
                .SetProperty(s => s.Duration, s => duration)
                .SetProperty(s => s.Rating, s => rating)
                .SetProperty(s => s.ImagePath, s => image)
                .SetProperty(s => s.ReleaseDate, s => release)
                .SetProperty(s => s.OverDate, s => over == false ? null: overDate)
                .SetProperty(s => s.ChangedDate, s => changed)
                .SetProperty(s => s.IsOver, s => over)
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
    }
}
