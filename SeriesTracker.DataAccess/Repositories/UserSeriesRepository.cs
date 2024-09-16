using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SeriesTracker.Core.Abstractions;

namespace SeriesTracker.DataAccess.Repositories
{
    public class UserSeriesRepository : IUserSeriesRepository
    {
        private readonly SeriesTrackerDbContext _context;

        public UserSeriesRepository(SeriesTrackerDbContext context)
        {
            _context = context;
        }
        public async Task<Guid> CreateAsync(UserSeries model)
        {

            var userSeriesEntity = new UserSeriesEntity
            {
                Id = model.Id,
                AnimeId = model.AnimeId,
                UserId = model.UserId,
                CategoryId = model.CategoryId,
                AddedDate = model.AddedDate,
                ChangedDate = model.ChangedDate,
                WatchedEpisode = model.WatchedEpisode,
                IsFavorite = model.IsFavorite,
            };

            await _context.UserSeriesEntities.AddAsync(userSeriesEntity);
            await _context.SaveChangesAsync();

            return userSeriesEntity.Id;
        }
    }
}
