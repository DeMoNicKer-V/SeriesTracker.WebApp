using SeriesTracker.Core.Models;
using System.Security.Claims;

namespace SeriesTracker.Application.Interfaces.Auth
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);

        ClaimsPrincipal ValidateToken(string token);
    }
}
