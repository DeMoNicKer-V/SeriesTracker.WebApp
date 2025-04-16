using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.API.Extensions;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Models.Shikimori;
using System.Text.Json;

namespace SeriesTracker.API.Controllers
{
    /// <summary>
    /// Контроллер для работы с данными аниме из сервиса Shikimori.
    /// Предоставляет методы для получения аниме по ID, имени или с использованием различных параметров.
    /// </summary>
    [ApiController]
    [Route("shikimori")] // Атрибут, определяющий маршрут для контроллера
    public class ShikimoriController : ControllerBase
    {
        private readonly ICalendarFetcher _fetcher;
        private readonly ILogger<ShikimoriController> _logger;
        private readonly IShikimoriService _shikimoriService;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="ShikimoriController"/>.
        /// </summary>
        /// <param name="shikimoriService">Сервис для работы с данными Shikimori.</param>
        /// <param name="fetcher">Сервис для получения данных календаря аниме.</param>
        /// <param name="logger">Логгер для записи информации о работе контроллера.</param>
        public ShikimoriController(IShikimoriService shikimoriService, ICalendarFetcher fetcher, ILogger<ShikimoriController> logger)
        {
            // Внедряем зависимости (Dependency Injection) и проверяем на null
            _shikimoriService = shikimoriService;

            _fetcher = fetcher;

            _logger = logger;
        }

        /// <summary>
        /// Получает список аниме, которые выйдут или выходят в ближайшие 7 дней.
        /// </summary>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK с массивом аниме из календаря
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("calendar")]
        public async Task<IResult> GetAiredAnimes()
        {
            try
            {
                // Получаем список аниме через сервис
                IEnumerable<CalendarAnimeItem> calendarAnimes = await _fetcher.FetchData();

                // Возвращаем список аниме с кодом 200 OK
                return Results.Ok(calendarAnimes);
            }
            catch (HttpRequestException ex)
            {
                // Логируем ошибку HTTP-запроса и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, $"HTTP error! Status: {ex.StatusCode}, Message: {ex.Message}");
            }
            catch (JsonException ex)
            {
                // Логируем ошибку десериализации JSON и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, $"JSON deserialization error: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Логируем общую ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while getting animes.");
            }
        }

        /// <summary>
        /// Получает информацию об аниме по его ID.
        /// </summary>
        /// <param name="id">ID аниме.</param>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK с данными аниме,
        /// 400 Bad Request, если ID имеет неверный формат, 404 Not Found, если аниме с указанным ID не найдено,
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("id/{id}")]
        public async Task<IResult> GetAnimeById(string id)
        {
            try
            {
                // Проверяем, является ли ID числом
                if (!int.TryParse(id, out _))
                {
                    // Если ID не является числом, логируем ошибку и возвращаем 400 Bad Request
                    return _logger.BadResponse(
                        logMessage: $"Attempt to get anime with incorrect ID: ({id}).",
                        resultMessage: "Incorrect anime ID format (must be a digit)."
                    );
                }

                // Получаем идентификатор пользователя из утверждений (claims)
                Guid userId = GetUserIdFromClaims();

                // Получаем аниме по ID через сервис
                AnimeSeriesFullDto anime = await _shikimoriService.GetAnimeById(userId, id);

                // Возвращаем аниме с кодом 200 OK
                return Results.Ok(anime);
            }
            catch (InvalidOperationException)
            {
                // Если аниме не найдено, возвращаем 404 Not Found
                return _logger.NotFoundResponse($"Anime with ID: {id} not found");
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, $"An unexpected error occurred while getting anime with ID: {id}");
            }
        }

        /// <summary>
        /// Получает список аниме с учетом указанных параметров запроса.
        /// </summary>
        /// <param name="request">Параметры запроса для фильтрации и сортировки аниме.</param>
        /// <returns>Результат выполнения запроса.  Возвращает 200 OK с массивом AnimeSeriesDto
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet]
        public async Task<IResult> GetAnimesByAllParams([FromQuery] ShikimoriParamsRequest request)
        {
            try
            {
                // Получаем идентификатор пользователя из утверждений (claims)
                Guid userId = GetUserIdFromClaims();

                // Получаем список аниме по заданным параметрам через сервис
                AnimeSeriesDto[] animes = await _shikimoriService.GetAnimesByAllParams(
                    userId,
                    request.Page,
                    request.Name,
                    request.Season,
                    request.Status,
                    request.Kind,
                    request.Genre,
                    request.Order,
                    request.Censored);

                // Возвращаем список аниме с кодом 200 OK
                return Results.Ok(animes);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while getting animes.");
            }
        }

        /// <summary>
        /// Получает список аниме по названию.
        /// </summary>
        /// <param name="name">Имя аниме для поиска.</param>
        /// <returns>Результат выполнения запроса.  Возвращает 200 OK с массивом AnimeSeriesDto
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("{name}")]
        public async Task<IResult> GetAnimesByName(string name)
        {
            try
            {
                // Получаем идентификатор пользователя из утверждений (claims)
                Guid userId = GetUserIdFromClaims();

                // Получаем список аниме по имени через сервис
                AnimeSeriesDto[] animes = await _shikimoriService.GetAnimesByName(userId, name);

                // Возвращаем список аниме с кодом 200 OK
                return Results.Ok(animes);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while getting animes.");
            }
        }

        /// <summary>
        /// Получает список всех жанров аниме.
        /// </summary>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK с массивом жанров
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("genres")]
        public async Task<IResult> GetGenres()
        {
            try
            {
                // Получаем список жанров через сервис
                var genres = await _shikimoriService.GetGenres();

                // Возвращаем список жанров с кодом 200 OK
                return Results.Ok(genres);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while getting genres.");
            }
        }

        /// <summary>
        /// Получает список сгруппированных жанров аниме.
        /// </summary>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK с данными сгруппированных жанров
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("groupGenres")]
        public async Task<IResult> GetGroupGenres()
        {
            try
            {
                // Получаем сгруппированные жанры через сервис
                GenreGroupingDTO groupingGenres = await _shikimoriService.GetGroupingGenres();

                // Возвращаем сгруппированные жанры с кодом 200 OK
                return Results.Ok(groupingGenres);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while getting grouping genres.");
            }
        }

        /// <summary>
        /// Получает случайное аниме.
        /// </summary>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK с ID случайного аниме
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("random")]
        public async Task<IResult> GetRandomAnime()
        {
            try
            {
                // Получаем случайное аниме через сервис
                ShikimoriAnimeBase anime = await _shikimoriService.GetRandomAnime();

                // Возвращаем ID случайного аниме с кодом 200 OK
                return Results.Ok(anime.Id);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while getting random anime.");
            }
        }

        /// <summary>
        /// Получает список недавно измененных аниме для указанного пользователя.
        /// </summary>
        /// <param name="userName">Имя пользователя Shikimori.</param>
        /// <param name="id">ID пользователя Shikimori.</param>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK с массивом недавно изменненых аниме пользователя
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("activity")]
        public async Task<IResult> GetRecentAnimes(string userName, string id)
        {
            try
            {
                // Получаем список аниме через сервис
                AnimeSeriesFullDto[] recentAnimes = await _shikimoriService.GetRecentAnimesByIds(userName, id);

                // Возвращаем список недавно изменненых аниме с кодом 200 OK
                return Results.Ok(recentAnimes);
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, "An unexpected error occurred while getting animes.");
            }
        }

        /// <summary>
        /// Получает ID пользователя из claims авторизации.
        /// </summary>
        /// <returns>Guid ID пользователя, если он найден и имеет правильный формат, иначе Guid.Empty.</returns>
        private Guid GetUserIdFromClaims()
        {
            // Получаем значение claim "userId" из claims пользователя.
            string? userClaims = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;

            // Проверяем, удалось ли преобразовать значение claim в Guid.
            if (Guid.TryParse(userClaims, out var userId))
            {
                // Если преобразование успешно, возвращаем ID пользователя.
                return userId;
            }
            else
            {
                // Если преобразование не удалось - возвращаем Guid.Empty.
                return Guid.Empty;
            }
        }
    }
}