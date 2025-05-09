using Microsoft.EntityFrameworkCore;
using SeriesTracker.Tests.UserSeriesTests;
using Xunit;

namespace SeriesTracker.Tests.UserSeriesRepositoryTests
{
    //  [Collection("Sequential")]: Атрибут, указывающий, что этот класс тестов входит в коллекцию "Sequential", что обеспечивает последовательное выполнение тестов.
    [Collection("Sequential")]
    public class EditUserSeriesTests : IClassFixture<UserSeriesRepositoryTestsBase>, IDisposable
    {
        //  _fixture: Экземпляр UserSeriesRepositoryTestsBase, предоставляющий доступ к UserSeriesRepository и DbContext.
        private readonly UserSeriesRepositoryTestsBase _fixture;

        public EditUserSeriesTests(UserSeriesRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task UpdateSeries_ExistingSeries_ReturnsTrue()
        {
            // Arrange: Подготовка данных для теста.
            var existingSeries = await _fixture._context.UserSeriesEntities.FirstAsync();

            int newWatchedEpisodes = 10;
            int newCategoryId = 2;
            bool newIsFavorite = true;
            string newChangedDate = DateTime.UtcNow.ToString("s");

            // Act: Выполнение тестируемого кода.
            bool result = await _fixture._userSeriesRepository.UpdateSeries(existingSeries.Id, newWatchedEpisodes, newCategoryId, newIsFavorite, newChangedDate);

            // Assert: Проверка результатов теста.
            Assert.True(result);

            //  Загружаем *обновленную* запись из базы данных, чтобы проверить изменения.
            var updatedUserSeries = await _fixture._context.UserSeriesEntities.FindAsync(existingSeries.Id);
            Assert.NotNull(updatedUserSeries);
            Assert.Equal(newWatchedEpisodes, updatedUserSeries.WatchedEpisodes);
            Assert.Equal(newCategoryId, updatedUserSeries.CategoryId);
            Assert.Equal(newIsFavorite, updatedUserSeries.IsFavorite);
            Assert.Equal(newChangedDate, updatedUserSeries.ChangedDate);
        }

        [Fact]
        public async Task UpdateSeries_NonExistingSeries_ReturnsFalse()
        {
            // Arrange: Подготовка данных для теста.
            var seriesId = Guid.NewGuid();

            // Act: Выполнение тестируемого кода.
            int newWatchedEpisodes = 10;
            int newCategoryId = 2;
            bool newIsFavorite = true;
            string newChangedDate = DateTime.UtcNow.ToString("s");
            bool result = await _fixture._userSeriesRepository.UpdateSeries(seriesId, newWatchedEpisodes, newCategoryId, newIsFavorite, newChangedDate);

            // Assert: Проверка результатов теста.
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
