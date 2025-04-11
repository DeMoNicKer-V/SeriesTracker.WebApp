using Microsoft.Extensions.DependencyInjection;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;

namespace SeriesTracker.Application.Extensions
{
    public static class ApplicationExtensions
    {
        /// <summary>
        /// Регистрирует сервисы уровня приложения (Application Layer) в контейнере зависимостей (DI).
        /// Эти сервисы реализуют бизнес-логику приложения.
        /// </summary>
        /// <param name="services">Коллекция сервисов, в которой будут зарегистрированы сервисы приложения.</param>
        /// <returns>Коллекция сервисов с зарегистрированными сервисами приложения.</returns>
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // Регистрация сервисов, связанных с управлением данными.
            // Эти сервисы предоставляют методы для работы с данными пользователей и категорий.
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserSeriesService, UserSeriesService>();
            services.AddScoped<ICategoryService, CategoryService>();

            // Регистрация сервиса аутентификации.
            services.AddScoped<IAuthenticationService, AuthenticationService>();

            // Регистрация сервисов, связанных с получением данных через Shikimori Api.
            services.AddScoped<IShikimoriService, ShikimoriService>();
            services.AddScoped<ICalendarFetcher, CalendarFetcher>();

            return services;
        }
    }
}