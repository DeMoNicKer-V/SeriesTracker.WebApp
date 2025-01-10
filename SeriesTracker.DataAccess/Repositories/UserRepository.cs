﻿using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly SeriesTrackerDbContext _context;

        public UserRepository(SeriesTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> ChangeUserRole(Guid userId, int roleId)
        {
            var roleEntity = await _context.RoleEntities.AsNoTracking().Where(r => r.Id == roleId).FirstAsync();
            var userEntity = await _context.UserEntities
                   .Include(u => u.Roles)
                   .FirstAsync(u => u.Id == userId);

            userEntity.Roles.Clear();
            userEntity.Roles.Add(roleEntity);

            await _context.SaveChangesAsync();
            return userId;
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
                Surname = user.Surname,
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

        public async Task<User> GetUserByEmail(string email)
        {
            var userEntity = await _context.UserEntities.AsNoTracking().Include(u => u.Roles).Where(c => c.Email == email).FirstAsync();
            return CreateUser(userEntity);
        }

        public async Task<User> GetUserById(Guid id)
        {
            var userEntity = await _context.UserEntities.AsNoTracking().Include(u => u.Roles).Where(c => c.Id == id).FirstAsync();
            return CreateUser(userEntity);
        }

        public async Task<User> GetUserByUserName(string username)
        {
            var userEntity = await _context.UserEntities.AsNoTracking().Include(u => u.Roles).Where(c => c.UserName == username).FirstAsync();
            return CreateUser(userEntity);
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

        public async Task<List<User>> GetUserList()
        {
            var users = await _context.UserEntities.AsNoTracking().Include(u => u.Roles).ToListAsync();

            var userList = users.Select(s => CreateUser(s)).ToList();

            return userList;
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

        public async Task<Guid> UpdateUser(Guid id, string username, string name, string surname, string email, string passwordHash, string avatar, string dateBirth)
        {
            await _context.UserEntities.Where(s => s.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(s => s.UserName, s => username)
                .SetProperty(s => s.Name, s => name)
                .SetProperty(s => s.Surname, s => surname)
                .SetProperty(s => s.Email, s => string.IsNullOrEmpty(email) ? s.Email : email)
                .SetProperty(s => s.PasswordHash, s => string.IsNullOrEmpty(passwordHash) ? s.PasswordHash : passwordHash)
                .SetProperty(s => s.DateBirth, s => dateBirth).SetProperty(s => s.Avatar, s => avatar)); ;

            return id;
        }

        private User CreateUser(UserEntity userEntity)
        {
            var user = User.Create(userEntity.Id, userEntity.UserName, userEntity.Name, userEntity.Surname, userEntity.Email, userEntity.PasswordHash, userEntity.Avatar, userEntity.DateBirth, userEntity.RegDate, userEntity.Roles.FirstOrDefault().Id);
            return user;
        }
    }
}