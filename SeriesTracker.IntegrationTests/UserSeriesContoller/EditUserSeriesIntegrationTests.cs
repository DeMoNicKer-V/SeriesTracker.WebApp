using Moq;
using Newtonsoft.Json;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using System.Net;
using System.Text;

namespace SeriesTracker.IntegrationTests.UserSeriesContoller
{
    public class EditUserSeriesIntegrationTests(CustomWebApplicationFactory factory) : TestsBase<IUserSeriesService>(factory)
    {
        // Тест, проверяющий, что метод UpdateSeries возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(true, true, HttpStatusCode.NoContent, null)]
        [InlineData(false, true, HttpStatusCode.NotFound, null)]
        [InlineData(true, true, HttpStatusCode.Unauthorized, typeof(UnauthorizedAccessException))]
        [InlineData(false, true, HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task UpdateSeries_ReturnsCorrectStatusCode(bool isSuccess, bool isAuthorized, HttpStatusCode expectedStatusCode, Type? exception)
        {
            // Arrange: Подготовка данных для теста
            CreateSeriesRequest request = new(999, 1, 5, true);
            var mockUserSeriesService = new Mock<IUserSeriesService>();
            if (exception != null)
            {
                mockUserSeriesService.Setup(service => service.UpdateSeries(It.IsAny<Guid>(), It.IsAny<int>(), It.IsAny<int>(), It.IsAny<bool>()))
                    .ThrowsAsync(exception == typeof(UnauthorizedAccessException) ? new UnauthorizedAccessException("Error") : new Exception("Error"));
            }
            else
            {
                mockUserSeriesService.Setup(service => service.UpdateSeries(It.IsAny<Guid>(), It.IsAny<int>(), It.IsAny<int>(), It.IsAny<bool>())).ReturnsAsync(isSuccess);
            }

            var client = CreateTestClient(mockUserSeriesService, isAuthorized);
            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PutAsync($"/series/update/{It.IsAny<Guid>()}", content);

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }
    }
}