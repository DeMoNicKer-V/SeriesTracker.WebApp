using Moq;
using SeriesTracker.Core.Abstractions;
using System.Net;

namespace SeriesTracker.IntegrationTests.UserSeriesContoller
{
    public class DeleteUserSeriesIntegrationTests(CustomWebApplicationFactory factory) : TestsBase<IUserSeriesService>(factory)
    {
        #region DeleteAllSeries Tests

        // Тест, проверяющий, что метод DeleteAllSeries возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(true, true, HttpStatusCode.NoContent, null)]
        [InlineData(true, true, HttpStatusCode.Unauthorized, typeof(UnauthorizedAccessException))]
        [InlineData(false, true, HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task DeleteAllSeries_ReturnsCorrectStatusCode(bool isSuccess, bool isAuthorized, HttpStatusCode expectedStatusCode, Type? exception)
        {
            // Arrange: Подготовка данных для теста
            var userName = "authUser";
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            if (exception != null)
            {
                mockUserSeriesService.Setup(service => service.DeleteAllSeries(It.IsAny<Guid>()))
                    .ThrowsAsync(exception == typeof(UnauthorizedAccessException) ? new UnauthorizedAccessException("Error") : new Exception("Error"));
            }
            else
            {
                mockUserSeriesService.Setup(service => service.DeleteAllSeries(It.IsAny<Guid>())).ReturnsAsync(isSuccess);
            }

            var client = CreateTestClient(mockUserSeriesService, isAuthorized);

            // Act: Выполнение тестируемого кода
            var response = await client.DeleteAsync($"series/{userName}/deleteAll");

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }

        #endregion DeleteAllSeries Tests

        #region DeleteSeries Tests

        // Тест, проверяющий, что метод DeleteSeries возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(true, true, HttpStatusCode.NoContent, null)]
        [InlineData(false, true, HttpStatusCode.NotFound, null)]
        [InlineData(true, true, HttpStatusCode.Unauthorized, typeof(UnauthorizedAccessException))]
        [InlineData(false, true, HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task DeleteSeries_ReturnsCorrectStatusCode(bool isSuccess, bool isAuthorized, HttpStatusCode expectedStatusCode, Type? exception)
        {
            // Arrange: Подготовка данных для теста
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            if (exception != null)
            {
                mockUserSeriesService.Setup(service => service.DeleteSeries(It.IsAny<Guid>()))
                    .ThrowsAsync(exception == typeof(UnauthorizedAccessException) ? new UnauthorizedAccessException("Error") : new Exception("Error"));
            }
            else
            {
                mockUserSeriesService.Setup(service => service.DeleteSeries(It.IsAny<Guid>())).ReturnsAsync(isSuccess);
            }

            var client = CreateTestClient(mockUserSeriesService, isAuthorized);

            // Act: Выполнение тестируемого кода
            var response = await client.DeleteAsync($"series/delete/{Guid.NewGuid()}");

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }

        #endregion DeleteSeries Tests
    }
}