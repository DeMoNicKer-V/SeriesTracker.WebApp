using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Models;
using SeriesTracker.Tests.UserSeriesTests;
using Xunit;

namespace SeriesTracker.Tests.UserSeriesRepositoryTests
{
    //  [Collection("Sequential")]: Атрибут, указывающий, что этот класс тестов входит в коллекцию "Sequential", что обеспечивает последовательное выполнение тестов.
    [Collection("Sequential")]
    public class CreateUserSeriesTests : IClassFixture<UserSeriesRepositoryTestsBase>, IDisposable
    {
        //  _fixture: Экземпляр UserSeriesRepositoryTestsBase, предоставляющий доступ к UserSeriesRepository и DbContext.
        private readonly UserSeriesRepositoryTestsBase _fixture;

        public CreateUserSeriesTests(UserSeriesRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        // Проверяет добавление UserSeries с существующим и несуществующим UserId, ожидая успешного добавления или DbUpdateException.
        [Theory]
        [InlineData(3, "a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b", 1, 0, true, false)] // существующий userId
        [InlineData(44, "5cd00718-3cd1-48d4-bdaf-d90d42dcca06", 2, 0, false, true)] // несуществующий userId, ожидаем ошибку
        public async Task Add_ValidModel_AddsUserSeriesAndReturnsId(int animeId, Guid userId, int categoryId, int watchedEpisodes, bool isFavorite, bool throwEX)
        {
            // Arrange: Подготовка данных для теста.
            var dateNow = DateTime.UtcNow.ToString("s");
            var seriesId = Guid.NewGuid();

            var model = UserSeries.Create(
                seriesId,
                animeId,
                userId,
                categoryId,
                watchedEpisodes,
                dateNow,
                dateNow,
                isFavorite
            );

            if (throwEX)
            {
                //  **Ожидаем DbUpdateException**
                await Assert.ThrowsAsync<DbUpdateException>(async () =>
                {
                    await _fixture._userSeriesRepository.Add(model);
                });
            }
            else
            {
                // Act: Выполнение тестируемого кода.
                Guid addedId = await _fixture._userSeriesRepository.Add(model);

                // Assert: Проверка результатов теста.
                Assert.Equal(seriesId, addedId);

                var addedUserSeries = await _fixture._context.UserSeriesEntities.FindAsync(seriesId);
                Assert.NotNull(addedUserSeries);
            }

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
