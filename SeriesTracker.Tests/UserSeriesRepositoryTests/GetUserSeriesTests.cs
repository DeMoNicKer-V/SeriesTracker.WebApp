using SeriesTracker.DataAccess.Entities;
using SeriesTracker.Tests.UserSeriesTests;
using Xunit;

namespace SeriesTracker.Tests.UserSeriesRepositoryTests
{
    //  [Collection("Sequential")]: Атрибут, указывающий, что этот класс тестов входит в коллекцию "Sequential", что обеспечивает последовательное выполнение тестов.
    [Collection("Sequential")]
    public class GetUserSeriesTests : IClassFixture<UserSeriesRepositoryTestsBase>, IDisposable
    {
        //  _fixture: Экземпляр UserSeriesRepositoryTestsBase, предоставляющий доступ к UserRepository и DbContext.
        private readonly UserSeriesRepositoryTestsBase _fixture;

        public GetUserSeriesTests(UserSeriesRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        // GetSeriesAnimeId_ExistingSeries_ReturnsCorrectDictionary: Тест, проверяющий, что метод GetSeriesAnimeId возвращает корректный словарь, содержащий данные о сериях аниме, связанных с пользователем, для заданного списка идентификаторов аниме. Тест параметризован и использует разные наборы данных для проверки различных сценариев, включая наличие и отсутствие данных.
        [Theory]
        [InlineData("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b", 2)] // userId1, 2 совпадения
        [InlineData("b8f8d7d4-2e3c-4c40-9b2e-9f4b1a6b3d8c", 1)] // userId2, 1 совпадение
        [InlineData("b8f8d7d4-2e3c-4c40-9b2e-9f4b1a6b3d8c", 0)] // userId2, 0 совпадение -> пустой массив
        public async Task GetSeriesAnimeId_ExistingSeries_ReturnsCorrectDictionary(string userIdString, int expectedCount)
        {
            //  Arrange: Подготовка данных для теста.
            Guid userId = Guid.Parse(userIdString);
            List<int> animeIds = expectedCount != 0 ? [1, 2, 3] : [];

            // Act: Выполнение тестируемого кода.
            var seriesCategoriesDictionary = await _fixture._userSeriesRepository.GetSeriesAnimeId(userId, animeIds);

            //  Assert: Проверка результатов теста.
            Assert.NotNull(seriesCategoriesDictionary);
            Assert.Equal(expectedCount, seriesCategoriesDictionary.Count);

            if (expectedCount == 0)
            {
                Assert.Empty(seriesCategoriesDictionary);
            }
            else
            {
                // Проверяем, что Dictionary содержит только ожидаемые AnimeId для конкретного пользователя
                foreach (var animeId in animeIds)
                {
                    if (_fixture._context.UserSeriesEntities.Any(s => s.UserId == userId && s.AnimeId == animeId))
                    {
                        Assert.True(seriesCategoriesDictionary.ContainsKey(animeId));
                    }
                    else
                    {
                        Assert.False(seriesCategoriesDictionary.ContainsKey(animeId));
                    }
                }
            }
        }


        //  Dispose: Метод, освобождающий ресурсы после выполнения тестов.
        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}
