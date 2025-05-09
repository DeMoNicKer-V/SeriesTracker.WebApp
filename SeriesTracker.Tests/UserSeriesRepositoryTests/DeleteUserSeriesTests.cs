using Microsoft.EntityFrameworkCore;
using SeriesTracker.Tests.UserSeriesTests;
using Xunit;

namespace SeriesTracker.Tests.UserSeriesRepositoryTests
{
    //  [Collection("Sequential")]: Атрибут, указывающий, что этот класс тестов входит в коллекцию "Sequential", что обеспечивает последовательное выполнение тестов.
    [Collection("Sequential")]
    public class DeleteUserSeriesTests : IClassFixture<UserSeriesRepositoryTestsBase>, IDisposable
    {
        //  _fixture: Экземпляр UserSeriesRepositoryTestsBase, предоставляющий доступ к UserSeriesRepository и DbContext.
        private readonly UserSeriesRepositoryTestsBase _fixture;

        public DeleteUserSeriesTests(UserSeriesRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        // Тест, проверяющий, что метод DeleteSeriesById возвращает True, если удаление произошло для заданного seriesId и false, если не произошло.
        [Theory]
        [InlineData("b8f8d7d4-2e3c-4c40-9b2e-9f4b1a6b3c7c", true)] // существующий seriesId, возврат - true
        [InlineData("bd1a4066-d901-4341-8132-f181ee7fe5d8", false)] // несуществующий seriesId, возврат - false
        public async Task DeleteUserSeries_ReturnsBool(string seriesId, bool isDeleted)
        {
            // Arrange: Подготовка данных для теста.
            Guid userSeriesId = Guid.Parse(seriesId);

            // Act. Выполнение тестируемого кода.
            bool deleteResult = await _fixture._userSeriesRepository.DeleteSeriesById(userSeriesId);

            // Assert. Проверка результатов теста.
            Assert.Equal(deleteResult, isDeleted);
        }

        // Тест, проверяющий, что метод DeleteAllSeriesByUserId возвращает True, если произошло удаления записей у заданного пользователя и false, если не произошло.
        [Theory]
        [InlineData("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b", true)] // существующий userId, возврат - true
        [InlineData("b1a1d7d4-2e3c-4c40-9b2e-9f4b1a6b1a1d", false)] // существующий userId, возврат - false, т.к. записей нет
        [InlineData("5eadb7da-ae32-42cd-bafc-2c89b5443ffe", false)] // несуществующий userId, возврат - false
        public async Task DeleteUserSeriesByUserId_ReturnsBool(string userId, bool isDeleted)
        {
            // Arrange: Подготовка данных для теста.
            Guid guidUserId = Guid.Parse(userId);

            // Act. Выполнение тестируемого кода.
            bool deleteResult = await _fixture._userSeriesRepository.DeleteAllSeriesByUserId(guidUserId);

            // Assert. Проверка результатов теста.
            Assert.Equal(deleteResult, isDeleted);
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