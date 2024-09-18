using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Application.Interfaces.Auth
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);

        ClaimsPrincipal ValidateToken(string token);
    }
}
