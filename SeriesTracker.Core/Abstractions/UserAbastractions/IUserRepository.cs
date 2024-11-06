﻿using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions.UserAbastractions
{
    public interface IUserRepository
    {
        Task<Guid> CreateUser(User user);
        Task<Guid> DeleteUser(Guid id);
        Task<HashSet<Permission>> GetUserPermissions(Guid userId);
        Task<User> GetUserById(Guid id);
        Task<List<User>> GetUserList();
        Task<User> GetUserByEmail(string email);
        Task<bool> CheckUsersEmail(string email);
        Task<bool> CheckUsersUserName(string userName);
        Task<User> GetUserByUserName(string username);
        Task<Guid> UpdateUser(Guid id, string username, string name, string surname, string email, string passwordHash, string avatar, string dateBirth);
    }
}
