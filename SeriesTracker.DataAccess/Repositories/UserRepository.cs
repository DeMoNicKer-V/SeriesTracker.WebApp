using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Dtos.UserDtos;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Repositories
{
    public class UserRepository(SeriesTrackerDbContext context) : IUserRepository
    {
        private readonly SeriesTrackerDbContext _context = context;

        public async Task<bool> ChangeUserRole(Guid userId, int roleId)
        {
            var roleEntity = await _context.RoleEntities.AsNoTracking().FirstOrDefaultAsync(r => r.Id == roleId);
            var userEntity = await _context.UserEntities
               .Include(u => u.Roles)
               .FirstOrDefaultAsync(u => u.Id == userId);

            if (userEntity == null || roleEntity == null)
            {
                return false; // Пользователь или роль не найдена
            }
            userEntity.Roles.Clear();
            userEntity.Roles.Add(roleEntity);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Guid> CreateUser(User user)
        {
            var roleEntity = await _context.RoleEntities
          .SingleOrDefaultAsync(r => r.Id == (int)Role.User)
          ?? throw new InvalidOperationException();

            var userEntity = new UserEntity
            {
                Id = user.Id,
                UserName = user.UserName,
                Name = user.Name,
                Roles = [roleEntity],
                SurName = user.SurName,
                Email = user.Email,
                PasswordHash = user.PasswordHash,
                Avatar = user.Avatar,
                DateBirth = user.DateBirth,
                RegDate = user.RegDate,
            };

            await _context.UserEntities.AddAsync(userEntity);
            await _context.SaveChangesAsync();

            return userEntity.Id;
        }

        public async Task<Guid> DeleteUser(Guid id)
        {
            await _context.UserEntities.Where(c => c.Id == id).ExecuteDeleteAsync();

            return id;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            var userEntity = await _context.UserEntities
                .AsNoTracking()
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Email == email);

            return MapUser(userEntity);
        }

        public async Task<User?> GetUserById(Guid id)
        {
            var userEntity = await _context.UserEntities
                            .AsNoTracking()
                            .Include(u => u.Roles)
                            .FirstOrDefaultAsync(u => u.Id == id);

            return MapUser(userEntity);
        }

        public async Task<User?> GetUserByUserName(string userName)
        {
            var userEntity = await _context.UserEntities
                            .AsNoTracking()
                            .Include(u => u.Roles)
                            .FirstOrDefaultAsync(u => u.UserName == userName);

            return MapUser(userEntity);
        }

        public async Task<Guid?> GetUserIdByEmail(string email)
        {
            return await _context.UserEntities
                .AsNoTracking()
                .Where(c => c.Email == email)
                .Select(s => s.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<Guid?> GetUserIdByUserName(string userName)
        {
            return await _context.UserEntities
                .AsNoTracking()
                .Where(c => c.UserName == userName)
                .Select(s => s.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<(List<UserDto>, int)> GetUserList(int page)
        {
            if (page <= 0) page = 1;
            var totalCount = await _context.UserEntities.CountAsync();
            var users = await _context.UserEntities.AsNoTracking().Include(u => u.Roles).Skip((page - 1) * 10).Take(10).ToListAsync();

            var userList = users.Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                UserName = u.UserName,
                RoleId = u.Roles.FirstOrDefault()?.Id ?? (int)Role.User,
                RegDate = u.RegDate,
            }).ToList();

            return (userList, totalCount);
        }

        public async Task<HashSet<Permission>> GetUserPermissions(Guid userId)
        {
            var roles = await _context.UserEntities
                .AsNoTracking()
                .Include(u => u.Roles)
                .ThenInclude(u => u.Permissions)
                .Where(u => u.Id == userId)
                .Select(u => u.Roles)
                .ToArrayAsync();

            return roles
                .SelectMany(r => r)
                .SelectMany(r => r.Permissions)
                .Select(p => (Permission)p.Id)
                .ToHashSet();
        }

        public async Task<HashSet<Role>> GetUserRoles(Guid userId)
        {
            var roles = await _context.UserEntities
                .AsNoTracking()
                .Include(u => u.Roles)
                .Where(u => u.Id == userId)
                .Select(u => u.Roles)
                .ToArrayAsync();

            return roles
                .SelectMany(r => r)
                .Select(p => (Role)p.Id)
                .ToHashSet();
        }

        public async Task<Guid> UpdateUser(Guid id, string userName, string name, string surName, string email, string passwordHash, string avatar, string dateBirth)
        {
            await _context.UserEntities.Where(s => s.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(s => s.UserName, s => userName)
                .SetProperty(s => s.Name, s => name)
                .SetProperty(s => s.SurName, s => surName)
                .SetProperty(s => s.Email, s => string.IsNullOrEmpty(email) ? s.Email : email)
                .SetProperty(s => s.PasswordHash, s => string.IsNullOrEmpty(passwordHash) ? s.PasswordHash : passwordHash)
                .SetProperty(s => s.DateBirth, s => dateBirth).SetProperty(s => s.Avatar, s => avatar)); ;

            return id;
        }

        private static User? MapUser(UserEntity? userEntity)
        {
            if (userEntity == null)
            {
                return null;
            }
            else
            {
                var user = User.Create(userEntity.Id, userEntity.UserName, userEntity.Name, userEntity.SurName, userEntity.Email, userEntity.PasswordHash, userEntity.Avatar, userEntity.DateBirth, userEntity.RegDate, userEntity.Roles.FirstOrDefault().Id);
                return user;
            }
        }
    }
}