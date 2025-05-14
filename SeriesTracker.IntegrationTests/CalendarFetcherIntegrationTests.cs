using Moq;
using Newtonsoft.Json;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.IntegrationTests
{
    public class CalendarFetcherIntegrationTests(CustomWebApplicationFactory factory) : TestsBase<ICalendarFetcher>(factory)
    {
        // Тест, проверяющий, что метод GetAiredAnimes возвращает возвращает верный HttpStatusCode.
        [Theory]
        [InlineData(true, true, HttpStatusCode.NoContent, null)]
        [InlineData(false, true, HttpStatusCode.NotFound, null)]
        [InlineData(true, true, HttpStatusCode.Unauthorized, typeof(UnauthorizedAccessException))]
        [InlineData(false, true, HttpStatusCode.InternalServerError, typeof(Exception))]
        public async Task UpdateSeries_ReturnsCorrectStatusCode(bool isSuccess, bool isAuthorized, HttpStatusCode expectedStatusCode, Type? exception)
        {
            // Arrange: Подготовка данных для теста
            CalendarAnimeItem[] animes = isSuccess ? new CalendarAnimeItem[1] : [];
            var mockCalenderFetcher = new Mock<ICalendarFetcher>();
            if (exception != null)
            {
                mockCalenderFetcher.Setup(service => service.FetchData())
                    .ThrowsAsync(exception == typeof(UnauthorizedAccessException) ? new UnauthorizedAccessException("Error") : new Exception("Error"));
            }
            else
            {
                mockCalenderFetcher.Setup(service => service.FetchData()).ReturnsAsync(animes);
            }

            var client = CreateTestClient(mockCalenderFetcher, isAuthorized);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"/animes/calender");

            // Assert: Проверка результатов теста
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }
    }
}
