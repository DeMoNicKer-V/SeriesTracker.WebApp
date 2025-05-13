using Moq;
using Newtonsoft.Json;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Exceptions;
using SeriesTracker.Core.Models.Shikimori;
using SeriesTracker.IntegrationTests.UserContoller;
using System.Net;

namespace SeriesTracker.IntegrationTests.UserSeriesContoller
{
    public class GetUserSeriesIntegrationTetsts(CustomWebApplicationFactory factory) : TestsBase<IUserSeriesService>(factory)
    {
        // Тест, проверяющий, что метод GetGroupSeries возвращает 200 OK и сгруппированный список аниме пользователя, если данные успешно получены.
        [Fact]
        public async Task GetGroupSeries_ReturnsOK_WithGroupedSeries()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            var userName = "existingUser";
            var seriesList = new List<SeriesGroupDto>([
                new SeriesGroupDto { Id = "0", Color = "#FFFFFF", SeriesCount = 3},
                new SeriesGroupDto { Id = "1", Color = "#FFFFF1", SeriesCount = 2 },
                new SeriesGroupDto { Id = "2", Color = "#FFFFF2", SeriesCount = 1 }
            ]);
            mockUserSeriesService.Setup(service => service.GetGroupShortSeries(userName)).ReturnsAsync(seriesList);

            var client = CreateTestClient(mockUserSeriesService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/series/{userName}/group");

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<SeriesGroupDto>>(content);
            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            Assert.Equal(seriesList.Count, result.Count);
        }

        // Тест, проверяющий, что метод GetGroupSeries возвращает 200 OK и пустой список, если у пользователя нет аниме в списке.
        [Fact]
        public async Task GetGroupSeries_ReturnsOK_WithEmptyList()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            var userName = "existingUser";
            var seriesList = new List<SeriesGroupDto>([]);
            mockUserSeriesService.Setup(service => service.GetGroupShortSeries(userName)).ReturnsAsync(seriesList);

            var client = CreateTestClient(mockUserSeriesService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/series/{userName}/group");

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<List<SeriesGroupDto>>(content);
            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            Assert.Empty(result);
        }

        // Тест, проверяющий, что метод GetGroupSeries возвращает 500 InternalServerError, если во время получения данных возникает необработанное исключение.
        [Fact]
        public async Task GetGroupSeries_UnexpectedException_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            var userName = "existingUser";
            var seriesList = new List<SeriesGroupDto>([]);
            mockUserSeriesService.Setup(service => service.GetGroupShortSeries(userName)).ThrowsAsync(new Exception("Error"));

            var client = CreateTestClient(mockUserSeriesService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/series/{userName}/group");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetUserProfileInfo возвращает 200 OK и информацию о профиле пользователя, если пользователь найден.
        [Fact]
        public async Task GetUserProfileInfo_UserFound_ReturnsOK()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            var userName = "existingUser";
            var userDto = new UserActivityDTO { UserName = userName, Email = "email", RegDate = "20-12-2024" };
            mockUserSeriesService.Setup(service => service.GetUserProfile(userName)).ReturnsAsync(userDto);

            var client = CreateTestClient(mockUserSeriesService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/series/{userName}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();
            Assert.Contains(userName, content);
        }

        // Тест, проверяющий, что метод GetUserProfileInfo возвращает 404 NotFound, если пользователь с указанным именем не найден.
        [Fact]
        public async Task GetUserProfileInfo_UserNotFound_ReturnsNotFound()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            var userName = "nonExistingUser";
            mockUserSeriesService.Setup(service => service.GetUserProfile(userName)).ReturnsAsync(null as UserActivityDTO);

            var client = CreateTestClient(mockUserSeriesService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/series/{userName}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetUserProfileInfo возвращает 500 InternalServerError, если во время получения профиля пользователя возникает необработанное исключение.
        [Fact]
        public async Task GetUserProfileInfo_UnexpectedException_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            var userName = "nonExistingUser";
            mockUserSeriesService.Setup(service => service.GetUserProfile(userName)).ThrowsAsync(new Exception("Error"));

            var client = CreateTestClient(mockUserSeriesService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/series/{userName}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetAnimesByUser возвращает 200 OK и список аниме пользователя, если запрос выполнен успешно.
        [Fact]
        public async Task GetAnimesByUser_SuccessfulRequest_ReturnsOK()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            var userName = "existingUser";
            int page = 1;
            int categoryId = (int)Category.Смотрю;
            bool isFavorite = false;

            ShikimoriAnime[] animes = [ new ShikimoriAnime{ Title = "Anime1"}, new ShikimoriAnime { Title = "Anime2" }];
            mockUserSeriesService.Setup(service => service.GetUserSeriesList(userName, page, categoryId, isFavorite)).ReturnsAsync(animes);

            var client = CreateTestClient(mockUserSeriesService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/series/{userName}/list/{page}?MyList={categoryId}&IsFavorite={isFavorite}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ShikimoriAnime[]>(content);
            Assert.Equal(animes.Length, content.Length);
        }

        // Тест, проверяющий, что метод GetAnimesByUser возвращает 404 NotFound, если пользователь с указанным именем не найден.
        [Fact]
        public async Task GetAnimesByUser_UserNotFound_ReturnsNotFound()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            var userName = "nonExistingUser";
            int page = 1;
            int categoryId = (int)Category.Смотрю;
            bool isFavorite = false;
            mockUserSeriesService.Setup(service => service.GetUserSeriesList(userName, page, categoryId, isFavorite)).ThrowsAsync(new NotFoundException("Error"));

            var client = CreateTestClient(mockUserSeriesService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/series/{userName}/list/{page}?MyList={categoryId}&IsFavorite={isFavorite}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetAnimesByUser возвращает 500 InternalServerError, если во время получения списка аниме пользователя возникает необработанное исключение.
        [Fact]
        public async Task GetAnimesByUser_UnexpectedException_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            var userName = "existingUser";
            int page = 1;
            int categoryId = (int)Category.Смотрю;
            bool isFavorite = false;
            mockUserSeriesService.Setup(service => service.GetUserSeriesList(userName, page, categoryId, isFavorite)).ThrowsAsync(new Exception("Error"));

            var client = CreateTestClient(mockUserSeriesService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/series/{userName}/list/{page}?MyList={categoryId}&IsFavorite={isFavorite}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetAnimesByUser возвращает пустой список, если у пользователя нет аниме в списке.
        [Fact]
        public async Task GetAnimesByUser_UserHasNoAnimes_ReturnsEmptyList()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            var userName = "existingUser";
            int page = 1;
            int categoryId = (int)Category.Смотрю;
            bool isFavorite = false;
            mockUserSeriesService.Setup(service => service.GetUserSeriesList(userName, page, categoryId, isFavorite)).ReturnsAsync([]);

            var client = CreateTestClient(mockUserSeriesService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/series/{userName}/list/{page}?MyList={categoryId}&IsFavorite={isFavorite}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ShikimoriAnime[]>(content);
            Assert.Empty(result);
        }
    }
}