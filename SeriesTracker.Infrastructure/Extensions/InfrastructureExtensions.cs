using Microsoft.Extensions.DependencyInjection;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Infrastructure.Authentication;

namespace SeriesTracker.Infrastructure.Extensions
{
    public static class InfrastructureExtensions
    {
        /// <summary>
        /// Регистрирует сервисы инфраструктуры в контейнере зависимостей (DI).
        /// </summary>
        /// <param name="services">Коллекция сервисов, в которой будут зарегистрированы сервисы инфраструктуры.</param>
        /// <returns>Коллекция сервисов с зарегистрированными сервисами инфраструктуры.</returns>
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IJwtProvider, JwtProvider>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();

            return services;
        }
    }
}