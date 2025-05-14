using Microsoft.AspNetCore.Identity.Data;
using Moq;
using Newtonsoft.Json;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using System.Net;
using System.Text;

namespace SeriesTracker.IntegrationTests.UserSeriesContoller
{
    public class CreateUserSeriesIntegrationTests(CustomWebApplicationFactory factory) : TestsBase<IUserSeriesService>(factory)
    {
        // Тест, проверяющий, что метод CreateSeries возвращает 204 NoContent при успешном создании записи о просмотре аниме.
        [Fact]
        public async Task CreateSeries_SuccessfulCreation_ReturnsNoContent() 
        {
            // Arrange: Подготовка данных для теста
            CreateSeriesRequest request = new(999, 0, 2, false);
            var seriesId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var mockUserSeriesSevice = new Mock<IUserSeriesService>();
            mockUserSeriesSevice.Setup(service => service.Create(seriesId, userId, request.AnimeId, request.CategoryId, request.WatchedEpisode, request.IsFavorite))
                .ReturnsAsync(seriesId);

            var client = CreateTestClient(mockUserSeriesSevice);
            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестиуремого кода.
            var response = await client.PostAsync($"/series/create", content);

            // Assert: Проверка результатов кода.
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        // Тест, проверяющий, что метод CreateSeries возвращает 401 Unauthorized, если пользователь не аутентифицирован.
        [Fact]
        public async Task CreateSeries_UnauthorizedUser_ReturnsUnauthorized()
        {
            // Arrange: Подготовка данных для теста
            CreateSeriesRequest request = new(0, 0, 0, false);

            var mockUserSeriesSevice = new Mock<IUserSeriesService>();
            mockUserSeriesSevice.Setup(service => service.Create(
                It.IsAny<Guid>(), // seriesId
                It.IsAny<Guid>(), // userId from claims
                request.AnimeId,
                request.CategoryId,
                request.WatchedEpisode,
                request.IsFavorite))
                .ThrowsAsync(new UnauthorizedAccessException("Error")); // Имитируем исключение

            var client = CreateTestClient(mockUserSeriesSevice);
            client.DefaultRequestHeaders.Clear();
            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестиуремого кода.
            var response = await client.PostAsync("/series/create", content);

            // Assert: Проверка результатов кода.
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        // Тест, проверяющий, что метод CreateSeries возвращает 500 InternalServerError, если во время создания записи возникает необработанное исключение.
        [Fact]
        public async Task CreateSeries_UnexpectedException_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста
            CreateSeriesRequest request = new(0, 0, 0, false);

            var mockUserSeriesSevice = new Mock<IUserSeriesService>();
            mockUserSeriesSevice.Setup(service => service.Create(
                It.IsAny<Guid>(), // seriesId
                It.IsAny<Guid>(), // userId from claims
                request.AnimeId,
                request.CategoryId,
                request.WatchedEpisode,
                request.IsFavorite))
                .ThrowsAsync(new Exception("Error")); // Имитируем исключение

            var client = CreateTestClient(mockUserSeriesSevice);
            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестиуремого кода.
            var response = await client.PostAsync("/series/create", content);

            // Assert: Проверка результатов кода.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }
    }
}
