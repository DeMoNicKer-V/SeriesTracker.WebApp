using Microsoft.Extensions.DependencyInjection;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Infrastructure.Authentication;

namespace SeriesTracker.Infrastructure.Extensions
{
    public static class InfrastructureExtensions
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IJwtProvider, JwtProvider>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();

            return services;
        }
    }
}
