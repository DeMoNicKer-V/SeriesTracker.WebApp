using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.API.Extensions;
using SeriesTracker.Application.Extensions;
using SeriesTracker.Core.Mappers;
using SeriesTracker.DataAccess;
using SeriesTracker.DataAccess.Extensions;
using SeriesTracker.Infrastructure.Authentication;
using SeriesTracker.Infrastructure.Extensions;

// Создаем WebApplicationBuilder, используя переданные аргументы командной строки.
// WebApplicationBuilder предоставляет методы для настройки веб-приложения.
var builder = WebApplication.CreateBuilder(args);
var services = builder.Services; // Получаем коллекцию сервисов, для добавления зависимостей.

// ---- Настройка логирования ----
// Добавляем консольный логгер, чтобы выводить логи в консоль.
builder.Logging.AddConsole();

// ---- Настройка конфигурации ----
// (Здесь могут быть дополнительные настройки конфигурации, например, добавление провайдеров конфигурации)

// ---- Настройка зависимостей (Dependency Injection) ----

// Добавляем инфраструктурные сервисы
services.AddInfrastructure();

// Добавляем сервисы уровня приложения
services.AddApplication();

// Добавляем сервисы для доступа к данным (репозитории).
services.AddDataAccess();

// Добавляем фабрику DbContext для работы с базой данных PostgreSQL.
// Используем конфигурацию подключения из appsettings.json.
services.AddDbContextFactory<SeriesTrackerDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(SeriesTrackerDbContext)));
    /* options.UseNpgsql().LogTo(Console.WriteLine, LogLevel.Information)
                   .EnableSensitiveDataLogging(); // Только для разработки!*/
});

// Добавляем AutoMapper для маппинга объектов.
// Указываем типы профилей маппинга, которые будут использоваться.
services.AddAutoMapper(typeof(AnimeMappingProfile));
services.AddAutoMapper(typeof(UserMappingProfile));

// ---- Настройка аутентификации и авторизации ----
// Добавляем сервисы аутентификации, используя конфигурацию.
services.AddApiAuthentication(builder.Configuration);

// Настраиваем параметры JWT из конфигурации приложения.
services.Configure<JwtOptions>(builder.Configuration.GetSection(nameof(JwtOptions)));

// Настраиваем параметры авторизации из конфигурации приложения.
services.Configure<AuthorizationOptions>(builder.Configuration.GetSection(nameof(AuthorizationOptions)));

// ---- Настройка API ----
// Добавляем поддержку контроллеров MVC.
services.AddControllers();

// Добавляем поддержку API Explorer для автоматического создания документации API.
services.AddEndpointsApiExplorer();

// Добавляем поддержку Swagger для генерации документации API.
services.AddSwaggerGen();

// ---- Создание и настройка WebApplication ----
// Собираем конфигурацию веб-приложения.
var app = builder.Build();

// ---- Настройка конвейера обработки запросов (middleware) ----

// Если приложение запущено в среде разработки...
if (app.Environment.IsDevelopment())
{
    // ...используем Swagger UI для документирования API.
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Перенаправляем HTTP-запросы на HTTPS.
app.UseHttpsRedirection();

// Настраиваем политику cookie.
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict, //  Спецификация SameSite=Strict
    HttpOnly = HttpOnlyPolicy.Always, //  Защита от XSS атак
    Secure = CookieSecurePolicy.Always //  Использование HTTPS
});

// Включаем CORS (Cross-Origin Resource Sharing) для запросов с http://localhost:3000.
app.UseCors(x =>
{
    x.WithOrigins("http://localhost:3000") // Разрешаем запросы с указанного origin.
                   .AllowAnyMethod() // Разрешаем все методы (GET, POST, PUT, DELETE и т.д.).
                   .AllowAnyHeader() // Разрешаем все заголовки.
                   .AllowCredentials(); // Разрешаем отправку учетных данных (куки, авторизационные заголовки).
});

// Включаем аутентификацию.
app.UseAuthentication();

// Включаем авторизацию.
app.UseAuthorization();

// Сопоставляем контроллеры с конечными точками.
app.MapControllers();

// ---- Запуск приложения ----
// Запускаем веб-приложение.
app.Run();

public partial class Program { }