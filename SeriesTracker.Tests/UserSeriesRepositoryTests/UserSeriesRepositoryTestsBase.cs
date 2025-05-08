using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Entities;
using SeriesTracker.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

                //  Заполняем базу данных seed-данными.
                SeedDatabase();

                //  Устанавливаем флаг _databaseInitialized в true, чтобы предотвратить повторную инициализацию базы данных.
                _databaseInitialized = true;
            }
        }

        //  SeedDatabase: Заполняет базу данных начальными данными (seed-данными).
        private void SeedDatabase()
        {
            // В процессе
        }
    }
}
