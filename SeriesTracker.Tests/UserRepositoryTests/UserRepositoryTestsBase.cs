using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SeriesTracker.DataAccess;
using SeriesTracker.DataAccess.Entities;
using SeriesTracker.DataAccess.Repositories;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    public class UserRepositoryTestsBase : IDisposable
    {
        public readonly SeriesTrackerDbContext _context;
        public readonly UserRepository _userRepository;

        private static bool _databaseInitialized; // Флаг для отслеживания инициализации
        private readonly DbContextOptions<SeriesTrackerDbContext> _options;

        public UserRepositoryTestsBase()
        {
            var options = Options.Create(new AuthorizationOptions
            {
                RolePermissions = new[] {
                new RolePermissions {  Role = "Admin", Permissions = new[] {  "Create", "Delete", "Update", "Read", "Add" } },
                 new RolePermissions { Role = "Moder", Permissions = new[] {  "Delete", "Update", "Read", "Add" } },
                new RolePermissions { Role = "User", Permissions = new[] { "Update", "Read", "Add" } }
            }
            });

            _options = new DbContextOptionsBuilder<SeriesTrackerDbContext>()
             .UseNpgsql("User ID=postgres;Password=1234;Host=localhost;Port=5432;Database=test_bd;")
             .Options;

            _context = new SeriesTrackerDbContext(_options, options);
            _userRepository = new UserRepository(_context);

            if (!_databaseInitialized)
            {
                try
                {
                    _context.Database.EnsureDeleted();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete database: {ex.Message}");
                }
                try
                {
                    _context.Database.Migrate();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to migrate database: {ex.Message}");
                    throw;
                }
                SeedDatabase();
                _databaseInitialized = true;
            }
        }

        public void Dispose()
        {
            // Освобождаем контекст
            _context.Dispose();

            // Отменяем финализацию (если есть финализатор)
            GC.SuppressFinalize(this);
        }

        private void SeedDatabase()
        {
            var admin = new UserEntity
            {
                Id = Guid.Parse("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b"),
                UserName = "testuser1",
                Email = "test1@mail.com",
                PasswordHash = "Hash-test1",
                Name = "Test1",
                SurName = "Test_1",
                Avatar = "Test_icon1",
                DateBirth = "20-12-1999",
                Roles = [_context.RoleEntities.Where(r => r.Id == 1).First()],
            };
            var moder = new UserEntity
            {
                Id = Guid.Parse("b8f8d7d4-2e3c-4c40-9b2e-9f4b1a6b3d8c"),
                UserName = "testuser2",
                Email = "test2@mail.com",
                PasswordHash = "Hash-test2",
                Name = "Test2",
                SurName = "Test_2",
                Avatar = "Test_icon2",
                DateBirth = "21-12-1999",
                Roles = [_context.RoleEntities.Where(r => r.Id == 2).First()],
            };
            var user = new UserEntity
            {
                Id = Guid.Parse("c9d9e8e5-3f4d-4d41-ab3f-af5c367c4e0d"),
                UserName = "testuser3",
                Email = "test3@mail.com",
                PasswordHash = "Hash-test3",
                Name = "Test3",
                SurName = "Test_3",
                Avatar = "Test_icon3",
                DateBirth = "22-12-1999",
                Roles = [_context.RoleEntities.Where(r => r.Id == 3).First()],
            };

            _context.UserEntities.AddRange(admin, moder, user);
            _context.SaveChanges();
        }
    }
}