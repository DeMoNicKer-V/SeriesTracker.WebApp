using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Application.Services
{
    public interface IAuthenticationService
    {
        Task<bool> Verify(string email, string password);

        Task<bool> EmailExists(string email);

        Task<bool> UserNameExists(string email);

        Task<string> Login(string email, string password);

        Task Register(string email, string password, string userName, string? avatar, string? name, string? surName, string? dateBirth);
    }
}