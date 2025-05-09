using Microsoft.EntityFrameworkCore;
using SeriesTracker.Tests.UserSeriesTests;
using Xunit;

namespace SeriesTracker.Tests.UserSeriesRepositoryTests
{
    //  [Collection("Sequential")]: Атрибут, указывающий, что этот класс тестов входит в коллекцию "Sequential", что обеспечивает последовательное выполнение тестов.
    [Collection("Sequential")]
    public class GetUserSeriesTests : IClassFixture<UserSeriesRepositoryTestsBase>, IDisposable
    {
        //  _fixture: Экземпляр UserSeriesRepositoryTestsBase, предоставляющий доступ к UserSeriesRepository и DbContext.
        private readonly UserSeriesRepositoryTestsBase _fixture;

        public GetUserSeriesTests(UserSeriesRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        // Тест, проверяющий, что метод GetSeriesAnimeId возвращает корректный словарь, содержащий данные о сериях аниме, связанных с пользователем, для заданного списка идентификаторов аниме. Тест параметризован и использует разные наборы данных для проверки различных сценариев, включая наличие и отсутствие данных.
        [Theory]
        [InlineData("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b", 2)] // userId1, 2 совпадения
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

        // Тест, проверяющий, что метод GetUserProfile возвращает корректный DTO (SeriesProfileDTO) в зависимости от наличия данных для указанного пользователя. Параметризован для проверки сценариев с существующим пользователем и данными, существующим пользователем без данных и несуществующим пользователем.
        [Theory]
        [InlineData("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b", true)] // Существующий UserId, есть данные
        [InlineData("b1a1d7d4-2e3c-4c40-9b2e-9f4b1a6b1a1d", false)] // Существующий UserId, нет данных
        [InlineData("874f34ab-ff59-48e7-a571-b634938cbfef", false)] // Несуществующий UserId
        public async Task GetUserProfile_ReturnsCorrectDto(string userIdString, bool hasData)
        {
            // Arrange: Подготовка данных для теста.
            Guid userId = Guid.Parse(userIdString);

            // Act: Выполнение тестируемого кода.
            var seriesProfileDto = await _fixture._userSeriesRepository.GetUserProfile(userId);

            //  Assert: Проверка результатов теста.
            if (hasData)
            {
                Assert.NotNull(seriesProfileDto);
                Assert.NotEmpty(seriesProfileDto.CategoryGroups);
                Assert.NotEmpty(seriesProfileDto.LastFiveSeries);
            }
            else
            {
                Assert.NotNull(seriesProfileDto);
                Assert.Empty(seriesProfileDto.CategoryGroups);
                Assert.Equal(string.Empty, seriesProfileDto.LastFiveSeries);
            }

        }

        // Тест, проверяющий, что метод GetGroupShortSeries возвращает корректный список SeriesGroupDto, сгруппированных по категориям, для заданного имени пользователя. Тест использует параметризацию для проверки различных сценариев, включая наличие данных, отсутствие данных и несуществующего пользователя.
        [Theory]
        [InlineData("user1", 2, 2)] // Существующий пользователь, 2 записи, 2 группы
        [InlineData("user3", 0, 0)] // Существующий пользователь, нет записей
        [InlineData("nonexistentuser", 0, 0)] // Несуществующий пользователь
        public async Task GetGroupShortSeries_ReturnsCorrectList(string userName, int dataCount, int groupCount)
        {
            // Act: Выполнение тестируемого кода.
            var seriesGroupList = await _fixture._userSeriesRepository.GetGroupShortSeries(userName);

            //  Assert: Проверка результатов теста.
            Assert.NotNull(seriesGroupList);

            if (dataCount > 0)
            {
                Assert.Equal(groupCount + 1, seriesGroupList.Count); // +1, потому что всегда добавляется элемент с Id = "0"
                Assert.Equal(dataCount, seriesGroupList[0].SeriesCount); // Проверяем SeriesCount у элемента с Id = "0"
                Assert.Equal("0", seriesGroupList[0].Id);
            }
            else
            {
                Assert.Empty(seriesGroupList);
            }
        }

        // Тест, проверяющий, что метод GetAnimeIdsList возвращает корректный список идентификаторов аниме (AnimeId) для заданного пользователя, страницы, категории и статуса "избранное".
        [Theory]
        [InlineData("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b", 1, 0, false, 2)] // userId1, страница 1, все категории, все, 2 результата
        [InlineData("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b", 1, 1, false, 1)] // userId1, страница 1, категория 1, все, 1 результат
        [InlineData("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b", 1, 0, true, 1)]  // userId1, страница 1, все категории, только избранное, 1 результат
        [InlineData("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b", 2, 0, false, 0)] // userId1, страница 2, все категории, все, 0 результатов (данных меньше)
        [InlineData("c9d9e8e5-304d-4d41-aa2f-a05c9b6a4e9d", 1, 0, false, 0)] // Несуществующий userId, страница 1, все категории, все, 0 результатов
        public async Task GetAnimeIdsList_ReturnsCorrectList(string userIdString, int page, int categoryId, bool isFavorite, int expectedCount)
        {
            // Arrange: Подготовка данных для теста.
            Guid userId = Guid.Parse(userIdString);

            // Act: Выполнение тестируемого кода.
            List<int> animeIds = await _fixture._userSeriesRepository.GetAnimeIdsList(userId, page, categoryId, isFavorite);

            // Assert: Проверка результатов теста.
            Assert.NotNull(animeIds);
            Assert.Equal(expectedCount, animeIds.Count);
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
