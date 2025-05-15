using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using SeriesTracker.DataAccess;

namespace SeriesTracker.Tests
{
    public class TestsBase : IDisposable
    {
        //  _context: Экземпляр DbContext для взаимодействия с базой данных.
        public readonly SeriesTrackerDbContext _context;

        //  _options: Опции для настройки DbContext, включая строку подключения к базе данных.
        private readonly DbContextOptions<SeriesTrackerDbContext> _options;

        public TestsBase()
        {
            // Получаем конфигурацию из appsettings.json
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            // Создаем options с дефолтными разрешениями
            var options = Options.Create(new AuthorizationOptions
            {
                RolePermissions = [
                 new RolePermissions {  Role = "Admin", Permissions = ["Create", "Delete", "Update", "Read", "Add"] },
                 new RolePermissions { Role = "Moder", Permissions = ["Delete", "Update", "Read", "Add"] },
                 new RolePermissions { Role = "User", Permissions = ["Update", "Read", "Add"] }
         ]
            });

            // Создаем опции для подключения к БД, используя npgsql и строку подключения
            _options = new DbContextOptionsBuilder<SeriesTrackerDbContext>()
             .UseNpgsql(configuration.GetConnectionString("SeriesTrackerDbTestContext")).Options;

            // Создаем экземпляр DbContext, используя настроенные опции и опции авторизации
            _context = new SeriesTrackerDbContext(_options, options);
        }

        //  Метод Dispose: Освобождает ресурсы, используемые классом.
        //  Реализует интерфейс IDisposable.
        public void Dispose()
        {
            // Освобождаем контекст, чтобы не держать подключение к БД открытым
            _context.Dispose();

            //  Предотвращаем вызов финализатора (если он есть), чтобы избежать возможных проблем с освобождением ресурсов.
            GC.SuppressFinalize(this);
        }
    }
}