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
        Task<Guid> CreateUser(User user);
        Task<Guid> DeleteUser(Guid id);
        Task<User> GetUserById(Guid id);
    }
}
