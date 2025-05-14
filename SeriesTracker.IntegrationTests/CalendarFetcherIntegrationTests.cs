using Moq;
using Newtonsoft.Json;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models.Shikimori;
using System.Net;

namespace SeriesTracker.IntegrationTests
{
    public class CalendarFetcherIntegrationTests(CustomWebApplicationFactory factory) : TestsBase<ICalendarFetcher>(factory)
    {
        // Тест, проверяющий, что метод GetAiredAnimes возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(HttpStatusCode.OK, null)]
        [InlineData(HttpStatusCode.InternalServerError, typeof(HttpRequestException))]
        [InlineData(HttpStatusCode.InternalServerError, typeof(JsonException))]
        [InlineData(HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task GetAiredAnimes_ReturnsCorrectStatusCode(HttpStatusCode expectedStatusCode, Type? exceptionType)
        {
            // Arrange: Подготовка данных для теста
            CalendarAnimeItem[] animes = new CalendarAnimeItem[1];
            var mockCalenderFetcher = new Mock<ICalendarFetcher>();
            if (exceptionType != null)
            {
                Exception? exception = Activator.CreateInstance(exceptionType) as Exception;
                mockCalenderFetcher.Setup(service => service.FetchData()).ThrowsAsync(exception);
            }
            else
            {
                mockCalenderFetcher.Setup(service => service.FetchData()).ReturnsAsync(animes);
            }

            var client = CreateTestClient(mockCalenderFetcher);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"/animes/calendar");

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }
    }
}