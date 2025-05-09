using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Entities;
using SeriesTracker.DataAccess.Repositories;

namespace SeriesTracker.Tests.UserSeriesTests
{
    //  UserSeriesRepositoryTestsBase: Базовый класс для тестов, связанных с UserSeriesRepository.
    //  Наследуется от TestsBase для получения доступа к DbContext и реализует IDisposable для освобождения ресурсов.
    public class UserSeriesRepositoryTestsBase : TestsBase, IDisposable
    {
        //  _userSeriesRepository: Экземпляр UserSeriesRepository, который будет тестироваться.
        public readonly UserSeriesRepository _userSeriesRepository;

        //  _databaseInitialized: Статический флаг, который гарантирует, что база данных будет инициализирована только один раз для всех тестов.
        private static bool _databaseInitialized;

        //  Выполняет настройку UserSeriesRepository и инициализацию базы данных (удаление, миграция, заполнение seed-данными).
        public UserSeriesRepositoryTestsBase()
        {
            //  Создаем экземпляр UserSeriesRepository, используя DbContext из базового класса TestsBase.
            _userSeriesRepository = new UserSeriesRepository(_context);

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
                SeedDatabase();

                //  Устанавливаем флаг _databaseInitialized в true, чтобы предотвратить повторную инициализацию базы данных.
                _databaseInitialized = true;
            }
        }

        //  SeedDatabase: Заполняет базу данных начальными данными (seed-данными).
        private void SeedDatabase()
        {
            var dateTime = DateTime.UtcNow;

            //  Создаем экземпляры UserEntity
            var hasTwoUser = new UserEntity
            {
                Id = Guid.Parse("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b"),
                UserName = "user1",
            };
            var hasOneUser = new UserEntity
            {
                Id = Guid.Parse("b8f8d7d4-2e3c-4c40-9b2e-9f4b1a6b3d8c"),
                UserName = "user2",
            };
            var hasNotUser = new UserEntity
            {
                Id = Guid.Parse("b1a1d7d4-2e3c-4c40-9b2e-9f4b1a6b1a1d"),
                UserName = "user3",
            };

            _context.UserEntities.AddRange(hasTwoUser, hasOneUser, hasNotUser);

            //  Создаем экземпляры UserSeriesEntity
            var userSeries1 = new UserSeriesEntity
            {
                Id = Guid.Parse("b8f8d7d4-2e3c-4c40-9b2e-9f4b1a6b3c7c"),
                UserId = hasTwoUser.Id,
                AnimeId = 1,
                CategoryId = 1,
                AddedDate = dateTime.ToString("s"),
                ChangedDate = dateTime.ToString("s"),
                WatchedEpisodes = 0,
                IsFavorite = false,
            };
            var userSeries2 = new UserSeriesEntity
            {
                Id = Guid.Parse("b8f8d7d4-2e3c-4c40-9b2e-9f4b1a6b3c6c"),
                UserId = hasTwoUser.Id,
                AnimeId = 2,
                CategoryId = 2,
                AddedDate = dateTime.ToString("s"),
                ChangedDate = dateTime.AddDays(5).ToString("s"),
                WatchedEpisodes = 11,
                IsFavorite = true,
            };
            var userSeries3 = new UserSeriesEntity
            {
                Id = Guid.Parse("b8f8d7d4-2e3c-4c40-9b2e-9f4b1a6b3c5c"),
                UserId = hasOneUser.Id,
                AnimeId = 2,
                CategoryId = 3,
                AddedDate = dateTime.AddDays(1).ToString("s"),
                ChangedDate = dateTime.AddDays(8).ToString("s"),
                WatchedEpisodes = 12,
                IsFavorite = true,
            };

            // Сохраняем изменения в базе данных.
            _context.UserSeriesEntities.AddRange(userSeries1, userSeries2, userSeries3);
            _context.SaveChanges();
        }
    }
}