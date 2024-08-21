using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.DataAccess.Repositories
{
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly SeriesTrackerDbContext _context;

        public UserRoleRepository(SeriesTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateUserRole(UserRole userRole)
        {
            var userRoleEntity = new UserRoleEntity
            {
                Id = userRole.Id,
                AccessLevelId = userRole.AccessLevelId,
                Name = userRole.Name,
            };

            await _context.UserRoleEntities.AddAsync(userRoleEntity);
            await _context.SaveChangesAsync();

            return userRoleEntity.Id;
        }

        public async Task<int> DeleteUserRole(int id)
        {
            await _context.UserRoleEntities.Where(c => c.Id == id).ExecuteDeleteAsync();

            return id;
        }

        public async Task<UserRole> GetUserRoleById(int id)
        {
            var userRoleEntity = await _context.UserRoleEntities.AsNoTracking().Where(c => c.Id == id).FirstAsync();

            var userRole = UserRole.Create(userRoleEntity.Id, userRoleEntity.AccessLevelId, userRoleEntity.Name).UserRole;

            return userRole;
        }

        public async Task<List<UserRole>> GetUserRoleList()
        {
            var userRoleEntities = await _context.UserRoleEntities.AsNoTracking().ToListAsync();

            var userRoleList = userRoleEntities.Select(u => UserRole.Create(u.Id, u.AccessLevelId, u.Name).UserRole).OrderBy(u => u.Id).ToList();

            return userRoleList;
        }

        public async Task<int> UpdateUserRole(int id, int accessLevelId, string name)
        {
            await _context.UserRoleEntities.Where(u => u.Id == id)
                .ExecuteUpdateAsync(u => u.SetProperty(u => u.AccessLevelId, u => accessLevelId)
                .SetProperty(u => u.Name, u => name));
            return id;
        }
    }
}
