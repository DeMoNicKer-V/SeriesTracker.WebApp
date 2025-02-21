using Microsoft.AspNetCore.Http;

namespace SeriesTracker.Application.Interfaces.Auth
{
    internal interface IJwtMiddleware
    {
        Task Invoke(HttpContext context);
    }
}
