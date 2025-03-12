using SeriesTracker.Core.Abstractions;
using System.Net.Http.Headers;
using System.Net;
using SeriesTracker.Core.Models.Shikimori;
using System.Text.Json;
using SeriesTracker.Core;

namespace SeriesTracker.Application.Services
{
    public class CalendarFetcher : ICalendarFetcher
    {
        private readonly HttpClient _httpClient;
        private readonly CookieContainer _cookieContainer;

        public CalendarFetcher()
        {
            _cookieContainer = new CookieContainer();
            var handler = new HttpClientHandler
            {
                CookieContainer = _cookieContainer,
                AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate, // Разрешить автоматическую декомпрессию
                UseCookies = true,
            };

            _httpClient = new HttpClient(handler);
            _httpClient.BaseAddress = new Uri(FetchDomain.BaseUrl);

            //  Добавляем куки при инициализации:
            string cookieName = FetchDomain.CoockieName;
            string cookieValue = FetchDomain.CoockieValue;
            string cookieDomain = FetchDomain.CoockieDomain;
            string cookiePath = FetchDomain.CookiePath;

            Cookie initialCookie = new Cookie(cookieName, cookieValue, cookiePath, cookieDomain); // Добавление CookiePath в конструктор
            _cookieContainer.Add(initialCookie);
        }

        public async Task<IEnumerable<CalendarAnimeItem>> FetchData()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, _httpClient.BaseAddress);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
     
            try
            {
                HttpResponseMessage response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode(); //  Проверяем статус

                string jsonString = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<IEnumerable<CalendarAnimeItem>>(jsonString);

                if (result == null)
                {
                    throw new JsonException("JSON deserialization returned null.");
                }
                return result;
            }
            catch (HttpRequestException ex)
            {
                throw new Exception($"HTTP error! Status: {ex.StatusCode}, Message: {ex.Message}", ex);
            }
            catch (JsonException ex)
            {
                throw new Exception($"JSON deserialization error: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"An unexpected error occurred: {ex.Message}", ex);
            }
        }

    }
}
