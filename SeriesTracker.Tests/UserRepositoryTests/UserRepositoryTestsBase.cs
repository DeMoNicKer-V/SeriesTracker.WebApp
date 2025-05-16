using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Entities;
using SeriesTracker.DataAccess.Repositories;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    //  UserRepositoryTestsBase: Базовый класс для тестов, связанных с UserRepository.
    //  Наследуется от TestsBase для получения доступа к DbContext и реализует IDisposable для освобождения ресурсов.
    public class UserRepositoryTestsBase : TestsBase, IDisposable
    {
        //  _userRepository: Экземпляр UserRepository, который будет тестироваться.
        public readonly UserRepository _userRepository;

        //  _databaseInitialized: Статический флаг, который гарантирует, что база данных будет инициализирована только один раз для всех тестов.
        private static bool _databaseInitialized;

        //  Выполняет настройку UserRepository и инициализацию базы данных (удаление, миграция, заполнение seed-данными).
        public UserRepositoryTestsBase()
        {
            //  Создаем экземпляр UserRepository, используя DbContext из базового класса TestsBase.
            _userRepository = new UserRepository(_context);

            //  Проверяем, была ли база данных уже инициализирована.
            if (!_databaseInitialized)
            {
                try
                {
                    //  Пытаемся удалить базу данных.
                    _context.Database.EnsureDeleted();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete database: {ex.Message}");
                }

                try
                {
                    //  Пытаемся выполнить миграцию базы данных.
                    //  Если миграция не удалась, перехватываем исключение, выводим сообщение в консоль и выбрасываем исключение дальше.
                    _context.Database.Migrate();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to migrate database: {ex.Message}");
                    throw;
                }

                //  Заполняем базу данных seed-данными.
                SeedDatabase();

                //  Устанавливаем флаг _databaseInitialized в true, чтобы предотвратить повторную инициализацию базы данных.
                _databaseInitialized = true;
            }
        }

        //  SeedDatabase: Заполняет базу данных начальными данными (seed-данными).
        private void SeedDatabase()
        {
            var regDate = DateTime.UtcNow.ToString("s");

            //  Создаем экземпляры admin, moder, user (мы просто создаем базовые entities)
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
                Role = _context.RoleEntities.Where(r => r.Id == 1).First(),
                RegDate = regDate,
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
                Role = _context.RoleEntities.Where(r => r.Id == 2).First(),
                RegDate = regDate,
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
                Role = _context.RoleEntities.Where(r => r.Id == 3).First(),
                RegDate = regDate,
            };

            // Сохраняем изменения в базе данных.
            _context.UserEntities.AddRange(admin, moder, user);
            _context.SaveChanges();
        }
    }
}