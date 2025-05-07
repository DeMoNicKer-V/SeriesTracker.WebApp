using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using SeriesTracker.DataAccess;
using SeriesTracker.DataAccess.Entities;
using SeriesTracker.DataAccess.Repositories;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    public class UserRepositoryTestsBase : IDisposable
    {
        protected readonly DbContextOptions<SeriesTrackerDbContext> _options;
        protected readonly SeriesTrackerDbContext _context;
        protected readonly UserRepository _userRepository;
        protected readonly Mock<IOptions<AuthorizationOptions>> _mockAuthOptions;

        protected UserRepositoryTestsBase()
        {
            // Настраиваем базу данных в памяти
            _options = new DbContextOptionsBuilder<SeriesTrackerDbContext>()
             .UseInMemoryDatabase(databaseName: "TestDatabase")
             .Options;

            // Создаем Mock для IOptions<AuthorizationOptions>
            _mockAuthOptions = new Mock<IOptions<AuthorizationOptions>>();

            // Настраиваем Mock, чтобы возвращать нужные значения (если необходимо)
            _mockAuthOptions.Setup(o => o.Value).Returns(new AuthorizationOptions
            {
                RolePermissions = new[] {
                new RolePermissions { Role = "Admin", Permissions = new[] {  "Create", "Delete", "Update", "Read", "Add" } },
                 new RolePermissions { Role = "Moder", Permissions = new[] {  "Delete", "Update", "Read", "Add" } },
                new RolePermissions { Role = "User", Permissions = new[] { "Update", "Read", "Add" } }
            }
            });

            _context = new SeriesTrackerDbContext(_options, _mockAuthOptions.Object); // Замените AppDbContext на ваш контекст
            _userRepository = new UserRepository(_context); // Инициализируем репозиторий

            // Заполняем базу данных тестовыми данными
            SeedDatabase();
        }

        private void SeedDatabase()
        {
            var admin = new UserEntity { Id = Guid.NewGuid(), UserName = "testuser1", Email = "test1@mail.com", Roles = [new RoleEntity { Name = "Admin" }] };
            var moder = new UserEntity { Id = Guid.NewGuid(), UserName = "testuser1", Email = "test2@mail.com", Roles = [new RoleEntity { Name = "Moder" }] };
            var user = new UserEntity { Id = Guid.NewGuid(), UserName = "testuser2", Email = "test3@mail.com", Roles = [new RoleEntity { Name = "User" }] };

            _context.UserEntities.AddRange(admin, moder, user);
            _context.SaveChanges();
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}