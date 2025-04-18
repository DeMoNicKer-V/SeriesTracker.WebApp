using Microsoft.Extensions.DependencyInjection;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Infrastructure.Authentication;

namespace SeriesTracker.Infrastructure.Extensions
{
    /// <summary>
    /// Расширения для конфигурации инфраструктурных сервисов приложения.
    /// Предоставляет методы для регистрации сервисов инфраструктуры в контейнере DI.
    /// </summary>
    public static class InfrastructureExtensions
    {
        /// <summary>
        /// Регистрирует сервисы инфраструктуры в контейнере зависимостей (DI).
        /// </summary>
        /// <param name="services">Коллекция сервисов, в которой будут зарегистрированы сервисы инфраструктуры.</param>
        /// <returns>Коллекция сервисов с зарегистрированными сервисами инфраструктуры.</returns>
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            // Регистрируем JwtProvider как scoped сервис для генерации JWT-токенов.
            services.AddScoped<IJwtProvider, JwtProvider>();

            // Регистрируем PasswordHasher как scoped сервис для хеширования паролей.
            services.AddScoped<IPasswordHasher, PasswordHasher>();

            return services;
        }
    }
}