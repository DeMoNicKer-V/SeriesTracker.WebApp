using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Repositories;

namespace SeriesTracker.Tests.CategoryRepositoryTests
{
    //  UserRepositoryTestsBase: Базовый класс для тестов, связанных с UserRepository.
    //  Наследуется от TestsBase для получения доступа к DbContext и реализует IDisposable для освобождения ресурсов.
    public class CategoryRepositoryTests : TestsBase, IDisposable
    {
        //  _categoryRepository: Экземпляр CategoryRepository, который будет тестироваться.
        public readonly CategoryRepository _categoryRepository;

        //  _databaseInitialized: Статический флаг, который гарантирует, что база данных будет инициализирована только один раз для всех тестов.
        private static bool _databaseInitialized;

        //  Выполняет настройку CategoryRepository и инициализацию базы данных (удаление, миграция).
        public CategoryRepositoryTests()
        {
            //  Создаем экземпляр CategoryRepository, используя DbContext из базового класса TestsBase.
            _categoryRepository = new CategoryRepository(_context);

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
                //  Устанавливаем флаг _databaseInitialized в true, чтобы предотвратить повторную инициализацию базы данных.
                _databaseInitialized = true;
            }
        }
    }
}