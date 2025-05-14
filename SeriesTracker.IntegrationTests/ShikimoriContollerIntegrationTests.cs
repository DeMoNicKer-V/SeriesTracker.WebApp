using Moq;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Models.Shikimori;
using System.Net;

namespace SeriesTracker.IntegrationTests
{
    public class ShikimoriContollerIntegrationTests(CustomWebApplicationFactory factory) : TestsBase<IShikimoriService>(factory)
    {
        // Тест, проверяющий, что метод GetAnimeById возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(HttpStatusCode.OK, null)]
        [InlineData(HttpStatusCode.BadRequest, null)]
        [InlineData(HttpStatusCode.NotFound, typeof(InvalidOperationException))]
        [InlineData(HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task GetAnimeById_ReturnsCorrectStatusCode(HttpStatusCode expectedStatusCode, Type? exceptionType)
        {
            // Arrange: Подготовка данных для теста
            var animeID = expectedStatusCode.Equals(HttpStatusCode.BadRequest) ? "awdwa" : "465";
            var mockShikimoriService = new Mock<IShikimoriService>();
            if (exceptionType != null)
            {
                Exception? exception = Activator.CreateInstance(exceptionType) as Exception;
                mockShikimoriService.Setup(service => service.GetAnimeById(It.IsAny<Guid>(), animeID)).ThrowsAsync(exception);
            }
            else
            {
                mockShikimoriService.Setup(service => service.GetAnimeById(It.IsAny<Guid>(), animeID)).ReturnsAsync(It.IsAny<AnimeSeriesFullDto>());
            }

            var client = CreateTestClient(mockShikimoriService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"animes/id/{animeID}");

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetAnimesByAllParams возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(HttpStatusCode.OK, null)]
        [InlineData(HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task GetAnimesByAllParams_ReturnsCorrectStatusCode(HttpStatusCode expectedStatusCode, Type? exceptionType)
        {
            // Arrange: Подготовка данных для теста
            var mockShikimoriService = new Mock<IShikimoriService>();
            if (exceptionType != null)
            {
                Exception? exception = Activator.CreateInstance(exceptionType) as Exception;
                mockShikimoriService.Setup(service => service.GetAnimesByAllParams(
                    It.IsAny<Guid>(),
                    It.IsAny<int>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<bool>())).ThrowsAsync(exception);
            }
            else
            {
                mockShikimoriService.Setup(service => service.GetAnimesByAllParams(
                    It.IsAny<Guid>(),
                    It.IsAny<int>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<bool>())).ReturnsAsync(It.IsAny<AnimeSeriesDto[]>());
            }

            var client = CreateTestClient(mockShikimoriService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync("animes");

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetAnimesByName возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(HttpStatusCode.OK, null)]
        [InlineData(HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task GetAnimesByName_ReturnsCorrectStatusCode(HttpStatusCode expectedStatusCode, Type? exceptionType)
        {
            // Arrange: Подготовка данных для теста

            var name = "attak on titan";
            var mockShikimoriService = new Mock<IShikimoriService>();
            if (exceptionType != null)
            {
                Exception? exception = Activator.CreateInstance(exceptionType) as Exception;
                mockShikimoriService.Setup(service => service.GetAnimesByName(It.IsAny<Guid>(), name)).ThrowsAsync(exception);
            }
            else
            {
                mockShikimoriService.Setup(service => service.GetAnimesByName(It.IsAny<Guid>(), name)).ReturnsAsync(It.IsAny<AnimeSeriesDto[]>);
            }

            var client = CreateTestClient(mockShikimoriService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"animes/{name}");

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetGenres возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(HttpStatusCode.OK, null)]
        [InlineData(HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task GetGenres_ReturnsCorrectStatusCode(HttpStatusCode expectedStatusCode, Type? exceptionType)
        {
            // Arrange: Подготовка данных для теста
            var mockShikimoriService = new Mock<IShikimoriService>();
            if (exceptionType != null)
            {
                Exception? exception = Activator.CreateInstance(exceptionType) as Exception;
                mockShikimoriService.Setup(service => service.GetGenres()).ThrowsAsync(exception);
            }
            else
            {
                mockShikimoriService.Setup(service => service.GetGenres()).ReturnsAsync(It.IsAny<GenreList>());
            }

            var client = CreateTestClient(mockShikimoriService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync("animes/genres");

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetGroupGenres возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(HttpStatusCode.OK, null)]
        [InlineData(HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task GetGroupGenres_ReturnsCorrectStatusCode(HttpStatusCode expectedStatusCode, Type? exceptionType)
        {
            // Arrange: Подготовка данных для теста
            var mockShikimoriService = new Mock<IShikimoriService>();
            if (exceptionType != null)
            {
                Exception? exception = Activator.CreateInstance(exceptionType) as Exception;
                mockShikimoriService.Setup(service => service.GetGroupingGenres()).ThrowsAsync(exception);
            }
            else
            {
                mockShikimoriService.Setup(service => service.GetGroupingGenres()).ReturnsAsync(It.IsAny<GenreGroupingDTO>());
            }

            var client = CreateTestClient(mockShikimoriService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync("animes/groupGenres");

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetRandomAnime возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(HttpStatusCode.OK, null)]
        [InlineData(HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task GetRandomAnime_ReturnsCorrectStatusCode(HttpStatusCode expectedStatusCode, Type? exceptionType)
        {
            // Arrange: Подготовка данных для теста
            var anime = new ShikimoriAnime { Id = 0 };
            var mockShikimoriService = new Mock<IShikimoriService>();
            if (exceptionType != null)
            {
                Exception? exception = Activator.CreateInstance(exceptionType) as Exception;
                mockShikimoriService.Setup(service => service.GetRandomAnime()).ThrowsAsync(exception);
            }
            else
            {
                mockShikimoriService.Setup(service => service.GetRandomAnime()).ReturnsAsync(anime);
            }

            var client = CreateTestClient(mockShikimoriService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync("animes/random");

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetRecentAnimes возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(HttpStatusCode.OK, null)]
        [InlineData(HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task GetRecentAnimes_ReturnsCorrectStatusCode(HttpStatusCode expectedStatusCode, Type? exceptionType)
        {
            // Arrange: Подготовка данных для теста
            var userName = "authUser";
            string ids = "1,2,3";
            var mockShikimoriService = new Mock<IShikimoriService>();
            if (exceptionType != null)
            {
                Exception? exception = Activator.CreateInstance(exceptionType) as Exception;
                mockShikimoriService.Setup(service => service.GetRecentAnimesByIds(userName, ids)).ThrowsAsync(exception);
            }
            else
            {
                mockShikimoriService.Setup(service => service.GetRecentAnimesByIds(userName, ids)).ReturnsAsync(It.IsAny<AnimeSeriesFullDto[]>());
            }

            var client = CreateTestClient(mockShikimoriService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"/animes/activity?userName={userName}&id={ids}");

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }
    }
}