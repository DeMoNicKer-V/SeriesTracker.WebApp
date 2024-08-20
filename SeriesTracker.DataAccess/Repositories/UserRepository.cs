using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Abstractions.UserAbastractions;
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
            var userEntity = new UserEntity
            {
                Id = user.Id,
                UserRoleId = user.UserRoleId,
                UserName = user.UserName,
                Name = user.Name,
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

        public async Task<Guid> DeleteUser(Guid id)
        {
            await _context.UserEntities.Where(c => c.Id == id).ExecuteDeleteAsync();

            return id;
        }

        public async Task<User> GetUserById(Guid id)
        {
            var userEntity = await _context.UserEntities.AsNoTracking().Where(c => c.Id == id).FirstAsync();

            var user = User.Create(userEntity.Id, userEntity.UserRoleId, userEntity.UserName, userEntity.Name, userEntity.Surname, userEntity.Email, userEntity.PasswordHash, userEntity.Avatar, userEntity.DateOfBirth, userEntity.RegistrationDate).User;

            return user;
        }

        public async Task<List<User>> GetUserList()
        {
            var userEntities = await _context.UserEntities.AsNoTracking().ToListAsync();

            var userList = userEntities.Select(u => User.Create(u.Id, u.UserRoleId, u.UserName, u.Name, u.Surname, u.Email, u.PasswordHash, u.Avatar, u.DateOfBirth, u.RegistrationDate).User).OrderBy(u => u.Id).ToList();

            return userList;
        }

        public async Task<Guid> UpdateUser(Guid id, int userRoleId, string userName, string name, string surName, string email, string password, string avatar, string dateBirth, string regDate)
        {
            await _context.UserEntities.Where(u => u.Id == id)
                .ExecuteUpdateAsync(u => u.SetProperty(u => u.UserRoleId, u => userRoleId)
                .SetProperty(u => u.UserName, u => userName)
                .SetProperty(u => u.Name, u => name)
                .SetProperty(u => u.Surname, u => surName).SetProperty(u => u.Email, u => email).SetProperty(u => u.PasswordHash, u => password).SetProperty(u => u.Avatar, u => avatar).SetProperty(u => u.DateOfBirth, u => dateBirth).SetProperty(u => u.RegistrationDate, u => regDate));

            return id;
        }
    }
}