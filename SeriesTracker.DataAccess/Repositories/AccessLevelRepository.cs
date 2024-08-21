using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Repositories
{
    internal class AccessLevelRepository : IAccessLevelRepository
    {
        private readonly SeriesTrackerDbContext _context;

        public AccessLevelRepository(SeriesTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateAccessLevel(AccessLevel accessLevel)
        {
            var accessLevelEntity = new AccessLevelEntity
            {
                Id = accessLevel.Id,
                Name = accessLevel.Name,
                Description = accessLevel.Description,
            };

            await _context.AccessLevelEntities.AddAsync(accessLevelEntity);
            await _context.SaveChangesAsync();

            return accessLevelEntity.Id;
        }

        public async Task<int> DeleteAccessLevel(int id)
        {
            await _context.AccessLevelEntities.Where(c => c.Id == id).ExecuteDeleteAsync();

            return id;
        }

        public async Task<AccessLevel> GetAccessLevelById(int id)
        {
            var accessLevelEntity = await _context.AccessLevelEntities.AsNoTracking().Where(c => c.Id == id).FirstAsync();

            var accessLevel = AccessLevel.Create(accessLevelEntity.Id, accessLevelEntity.Name, accessLevelEntity.Description).AccessLevel;

            return accessLevel;
        }

        public async Task<List<AccessLevel>> GetAccessLevelList()
        {
            var accessLevelEntities = await _context.AccessLevelEntities.AsNoTracking().ToListAsync();

            var accessLevelList = accessLevelEntities.Select(a => AccessLevel.Create(a.Id, a.Name, a.Description).AccessLevel).OrderBy(a => a.Id).ToList();

            return accessLevelList;
        }

        public async Task<int> UpdateAccessLevel(int id, string name, string description)
        {
            await _context.AccessLevelEntities.Where(a => a.Id == id)
                .ExecuteUpdateAsync(a => a.SetProperty(a => a.Name, u => name)
                .SetProperty(a => a.Description, u => description));
            return id;
        }
    }
}