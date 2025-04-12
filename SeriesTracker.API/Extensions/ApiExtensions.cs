using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Infrastructure.Authentication;
using System.Text;

namespace SeriesTracker.API.Extensions
{
    /// <summary>
    /// Расширения для настройки аутентификации и авторизации API.
    /// Предоставляет методы для добавления аутентификации на основе JWT, регистрации сервисов авторизации
    /// и применения политик авторизации на основе разрешений.
    /// </summary>
    public static class ApiExtensions
    {
        /// <summary>
        /// Добавляет аутентификацию на основе JWT (JSON Web Token) в приложение.
        /// Читает настройки JWT из конфигурации, настраивает параметры валидации токена
        /// и регистрирует сервисы, необходимые для авторизации.
        /// </summary>
        /// <param name="services">Коллекция сервисов для добавления зависимостей.</param>
        /// <param name="configuration">Конфигурация приложения.</param>
        public static void AddApiAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            // Получаем настройки JWT из конфигурации.
            var jwtOptions = configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>();

            // Добавляем аутентификацию с использованием схемы JWT Bearer.
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
                {
                    // Настраиваем параметры валидации токена.
                    options.TokenValidationParameters = new()
                    {
                        ValidateIssuer = true, // Включаем валидацию издателя.
                        ValidateAudience = true, // Включаем валидацию аудитории.
                        ValidIssuer = jwtOptions!.Issuer,
                        ValidAudience = jwtOptions!.Audience, 
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions!.SecretKey))
                    };

                    // Настраиваем события JWT Bearer для обработки входящих запросов.
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var token = context.Request.Cookies["secretCookie"];  // Получаем из куки
                            if (!string.IsNullOrEmpty(token))
                            {
                                context.Token = token;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            // Регистрируем сервисы авторизации.
            services.AddScoped<IPermissionSevice, PermissionService>(); // Регистрируем сервис для проверки разрешений.
            services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>(); // Регистрируем обработчик авторизации на основе разрешений.

            // Настраиваем политики авторизации на основе разрешений.
            services.AddAuthorization(options =>
            {
                // Перебираем все значения перечисления Permission.
                foreach (var permission in Enum.GetValues(typeof(Permission)))
                {
                    // Добавляем политику авторизации для каждого разрешения.
                    options.AddPolicy(permission.ToString(), policy =>
                    {
                        // Требуем наличия разрешения для доступа к ресурсу.
                        policy.Requirements.Add(new PermissionRequirement(new[] { (Permission)permission }));
                    });
                }
            });
        }

        /// <summary>
        /// Расширение для применения политик авторизации на основе разрешений к конечным точкам API.
        /// </summary>
        /// <typeparam name="TBuilder">Тип строителя конечных точек.</typeparam>
        /// <param name="builder">Строитель конечных точек.</param>
        /// <param name="permissions">Массив разрешений, необходимых для доступа к конечной точке.</param>
        /// <returns>Строитель конечных точек с добавленными требованиями авторизации.</returns>
        public static IEndpointConventionBuilder RequirePermissions<TBuilder>(
        this TBuilder builder, params Permission[] permissions)
            where TBuilder : IEndpointConventionBuilder
        {
            return builder
                .RequireAuthorization(pb =>
                    pb.AddRequirements(new PermissionRequirement(permissions)));
        }
    }
}