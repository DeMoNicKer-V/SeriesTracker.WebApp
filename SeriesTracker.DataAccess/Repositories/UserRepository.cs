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
                DateOfBirth = user.DateOfBirth,
                RegistrationDate = user.RegistrationDate,
            };

            await _context.UserEntities.AddAsync(userEntity);
            await _context.SaveChangesAsync();

            return userEntity.Id;
        }

        public async Task<User> GetUserById(Guid id)
        {
            var userEntity = await _context.UserEntities.AsNoTracking().Where(c => c.Id == id).FirstAsync();

            var user = User.Create(userEntity.Id, userEntity.UserName, userEntity.Name, userEntity.Surname, userEntity.Email, userEntity.PasswordHash, userEntity.Avatar, userEntity.DateOfBirth, userEntity.RegistrationDate).User;

            return user;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var userEntity = await _context.UserEntities.AsNoTracking().Where(c => c.Email == email).FirstAsync();

            var user = User.Create(userEntity.Id, userEntity.UserName, userEntity.Name, userEntity.Surname, userEntity.Email, userEntity.PasswordHash, userEntity.Avatar, userEntity.DateOfBirth, userEntity.RegistrationDate).User;

            return user;
        }

        public async Task<User> GetUserByUserName(string username)
        {
            var userEntity = await _context.UserEntities.AsNoTracking().Where(c => c.UserName == username).FirstAsync();

            var user = User.Create(userEntity.Id, userEntity.UserName, userEntity.Name, userEntity.Surname, userEntity.Email, userEntity.PasswordHash, userEntity.Avatar, userEntity.DateOfBirth, userEntity.RegistrationDate).User;

            return user;
        }

        public async Task<bool> CheckUsersUserName(string userName)
        {
            return await _context.UserEntities.AsNoTracking().Where(c => c.UserName == userName).FirstOrDefaultAsync() != null;
        }

        public async Task<bool> CheckUsersEmail(string email)
        {
            return await _context.UserEntities.AsNoTracking().Where(c => c.Email == email).FirstOrDefaultAsync() != null;
        }

        public async Task<Guid> DeleteUser(Guid id)
        {
            await _context.UserEntities.Where(c => c.Id == id).ExecuteDeleteAsync();

            return id;
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
    }
}