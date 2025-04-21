using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models.Shikimori;
using SeriesTracker.Core;
using System.Net;
using System.Net.Http.Headers;
using Newtonsoft.Json;


namespace SeriesTracker.Application {
    /// <summary>
    /// Сервис для получения данных календаря аниме.
    /// Отвечает за загрузку данных из внешнего источника и фильтрацию элементов.
    /// </summary>
    public class CalendarFetcher : ICalendarFetcher
    {
        private readonly HttpClient _httpClient;
        private readonly CookieContainer _cookieContainer;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="CalendarFetcher"/>.
        /// Создает и настраивает HttpClient для взаимодействия с внешним API.
        /// </summary>
        public CalendarFetcher()
        {
            // Создаем контейнер для хранения куки, которые будут использоваться в запросах.
            _cookieContainer = new CookieContainer();

            // Настраиваем HttpClientHandler для обработки куки и автоматической декомпрессии.
            var handler = new HttpClientHandler
            {
                CookieContainer = _cookieContainer, // Указываем контейнер для куки.
                AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate, // Разрешаем автоматическую декомпрессию ответов (GZip и Deflate).
                UseCookies = true, // Включаем использование куки.
            };

            // Создаем HttpClient с настроенным обработчиком.
            _httpClient = new HttpClient(handler)
            {
                BaseAddress = new Uri(FetchDomain.BaseUrl) // Устанавливаем базовый адрес API.
            };

            // Добавляем куки при инициализации:
            string cookieName = FetchDomain.CoockieName; // Получаем имя куки из конфигурации.
            string cookieValue = FetchDomain.CoockieValue; // Получаем значение куки из конфигурации.
            string cookieDomain = FetchDomain.CoockieDomain; // Получаем домен куки из конфигурации.
            string cookiePath = FetchDomain.CookiePath; // Получаем путь куки из конфигурации.

            // Создаем объект куки с указанными параметрами.
            Cookie initialCookie = new(cookieName, cookieValue, cookiePath, cookieDomain); // Добавление CookiePath в конструктор
            _cookieContainer.Add(initialCookie); // Добавляем куки в контейнер.
        }

        public async Task<IEnumerable<CalendarAnimeItem>> FetchData()
        {
            // Создаем HTTP-запрос на получение данных из API.
            var request = new HttpRequestMessage(HttpMethod.Get, _httpClient.BaseAddress);

            // Добавляем заголовок Accept для указания, что мы ожидаем получить JSON-ответ.
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            // Отправляем HTTP-запрос и получаем ответ.
            HttpResponseMessage response = await _httpClient.SendAsync(request);

            // Проверяем, успешно ли выполнен запрос (код состояния HTTP 2xx).
            response.EnsureSuccessStatusCode();

            // Читаем содержимое ответа в виде строки.
            string jsonString = await response.Content.ReadAsStringAsync();

            // Десериализуем JSON-строку в коллекцию объектов CalendarAnimeItem.
            var result = JsonConvert.DeserializeObject<IEnumerable<CalendarAnimeItem>>(jsonString) ?? throw new JsonException("JSON deserialization returned null.");

            // Фильтруем элементы, чтобы вернуть только те, у которых дата следующего эпизода находится в пределах следующих 7 дней.
            var filteredItems = result.Where(i => DateTime.Parse(i.NextEpisodeAt).Date < DateTime.Now.AddDays(7).Date);

            // Возвращаем отфильтрованную коллекцию элементов.
            return filteredItems;
        }
    }
}