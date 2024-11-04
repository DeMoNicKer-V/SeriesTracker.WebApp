using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions.UserAbastractions
{
    public interface IUserService
    {
        Task Register(string email, string password, string nickname, string avatar, string name, string surname, string dateBirth);
        Task<string> Login(string email, string password);
        Task<bool> Verify(string email, string password);
        string HashPassword(string password);
        Task<Guid> CreateUser(User user);
        Task<Guid> DeleteUser(Guid id);
        Task<User> GetUserById(Guid id);
        Task<bool> CheckUsersEmail(string email);
        Task<bool> CheckUsersUserName(string userName);
        Task<ICollection<Permission>> GetUserPermissions(Guid id);
        Task<User> GetUserByUserName(string username);
        Task<Guid> UpdateUser(Guid id, string username, string name, string surname, string email, string passwordHash, string avatar, string dateBirth);
    }
}
