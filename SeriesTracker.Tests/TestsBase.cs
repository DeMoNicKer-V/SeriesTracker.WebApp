using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SeriesTracker.DataAccess;

namespace SeriesTracker.Tests
{
    public class TestsBase : IDisposable
    {
        //  _context: Экземпляр DbContext для взаимодействия с базой данных.
        //  Используется для выполнения операций CRUD (создание, чтение, обновление, удаление) в тестах.
        public readonly SeriesTrackerDbContext _context;

        //  _options: Опции для настройки DbContext, включая строку подключения к базе данных.
        //  Используются при создании экземпляра DbContext.
        private readonly DbContextOptions<SeriesTrackerDbContext> _options;

        // Конструктор класса TestsBase.
        // Выполняет настройку конфигурации и создание экземпляра DbContext.
        public TestsBase()
        {
            // Создаем options с дефолтными разрешениями
            var options = Options.Create(new AuthorizationOptions
            {
                RolePermissions = [
                 new RolePermissions {  Role = "Admin", Permissions = new[] {  "Create", "Delete", "Update", "Read", "Add" } },
                 new RolePermissions { Role = "Moder", Permissions = new[] {  "Delete", "Update", "Read", "Add" } },
                 new RolePermissions { Role = "User", Permissions = new[] { "Update", "Read", "Add" } }
         ]
            });

            // Создаем опции для подключения к БД, используя npgsql и строку подключения
            _options = new DbContextOptionsBuilder<SeriesTrackerDbContext>()
             .UseNpgsql("User ID=postgres;Password=1234;Host=localhost;Port=5432;Database=test_bd;")
             .Options;

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
