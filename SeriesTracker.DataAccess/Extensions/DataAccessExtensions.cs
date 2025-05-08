using Microsoft.Extensions.DependencyInjection;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.DataAccess.Repositories;

namespace SeriesTracker.DataAccess.Extensions
{
    public static class DataAccessExtensions
    {
        /// <summary>
        /// Регистрирует репозитории доступа к данным в контейнере зависимостей (DI).
        /// </summary>
        /// <param name="services">Коллекция сервисов, в которой будут зарегистрированы репозитории доступа к данным.</param>
        /// <returns>Коллекция сервисов с зарегистрированными репозиторими доступа к данным.</returns>
        public static IServiceCollection AddDataAccess(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserSeriesRepository, UserSeriesRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();

            return services;
        }
    }
}