using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Entities;
using Xunit;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    //  [Collection("Sequential")]: Атрибут, указывающий, что этот класс тестов входит в коллекцию "Sequential", что обеспечивает последовательное выполнение тестов.
    [Collection("Sequential")]
    public class DeleteUserTests : IClassFixture<UserRepositoryTestsBase>, IDisposable
    {
        //  _fixture: Экземпляр UserRepositoryTestsBase, предоставляющий доступ к UserRepository и DbContext.
        private readonly UserRepositoryTestsBase _fixture;

        public DeleteUserTests(UserRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        // Тест, проверяющий, что метод DeleteUser успешно удаляет существующего пользователя и возвращает true.
        [Fact]
        public async Task DeleteUser_ExistingUser_ReturnsTrue()
        {
            //  Arrange: Подготовка данных для теста.
            UserEntity user = _fixture._context.UserEntities.First();

            //  Act: Выполнение тестируемого кода.
            bool result = await _fixture._userRepository.DeleteUser(user.Id);

            //  Assert: Проверка результатов теста.
            Assert.True(result);
        }

        // Тест, проверяющий, что метод DeleteUser возвращает false, если пользователь не существует.
        [Fact]
        public async Task DeleteUser_NonExistingUser_ReturnsFalse()
        {
            //  Arrange: Подготовка данных для теста.
            var nonExistingUserId = Guid.NewGuid();

            //  Act: Выполнение тестируемого кода.
            bool result = await _fixture._userRepository.DeleteUser(nonExistingUserId);

            //  Assert: Проверка результатов теста.
            Assert.False(result);
        }

        //  Dispose: Метод, освобождающий ресурсы после выполнения тестов.
        public void Dispose()
        {
            foreach (var entry in _fixture._context.ChangeTracker.Entries().ToList())
            {
                entry.State = EntityState.Detached;
            }
            GC.SuppressFinalize(this);
        }
    }
}