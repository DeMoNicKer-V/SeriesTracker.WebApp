using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.API.Extensions;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Exceptions;
using SeriesTracker.Infrastructure.Authentication;
using System.ComponentModel.DataAnnotations;

namespace SeriesTracker.API.Controllers
{
    /// <summary>
    /// Контроллер для работы с пользовательскими списками аниме.
    /// Предоставляет методы для получения информации о профиле пользователя, списках аниме и их группировке.
    /// </summary>
    [ApiController]
    [Route("series")] // Атрибут, определяющий маршрут для контроллера
    public class UserSeriesController : ControllerBase
    {
        private readonly ILogger<UserSeriesController> _logger;
        private readonly IUserSeriesService _userSeriesService;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="UserSeriesController"/>.
        /// </summary>
        /// <param name="userSeriesService">Сервис для работы с пользовательскими списками аниме.</param>
        /// <param name="logger">Логгер для записи информации о работе контроллера.</param>
        public UserSeriesController(IUserSeriesService userSeriesService, ILogger<UserSeriesController> logger)
        {
            // Внедряем зависимость (Dependency Injection) сервиса пользоватеских списков аниме и проверяем на null.
            _userSeriesService = userSeriesService ?? throw new ArgumentNullException(nameof(userSeriesService));

            // Внедряем зависимость (Dependency Injection) логгера и проверяем на null.
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Получает информацию о профиле пользователя.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK с данными профиля пользователя, 
        /// 404 Not Found, если пользователь не найден, или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("{userName}")]
        public async Task<IResult> GetUserProfileInfo(string userName)
        {
            try
            {
                var userProfileInfo = await _userSeriesService.GetUserProfile(userName);

                if (userProfileInfo == null)
                {
                    return _logger.NotFoundResponse(message: $"User ({userName}) not found");
                }
                return Results.Ok(userProfileInfo);
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(exception: ex, logMessage: "An unexpected error occurred while getting user's profile");
            }
        }

        /// <summary>
        /// Получает сгруппированный список аниме пользователя по категориям.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK со сгруппированным списком аниме,
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("{userName}/group")]
        public async Task<IResult> GetGroupSeries(string userName)
        {
            try
            {
                var categoryGroup = await _userSeriesService.GetGroupShortSeries(userName);
                return Results.Ok(categoryGroup);
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, "An unexpected error occurred while receiving this user's list.");
            }
        }

        /// <summary>
        /// Получает список аниме пользователя с учетом параметров запроса.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <param name="page">Номер страницы списка.</param>
        /// <param name="request">Параметры запроса для фильтрации списка аниме.</param>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK со списком аниме или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("{userName}/list/{page}")]
        public async Task<IResult> GetAnimesByUser(string userName, int page, [FromQuery] UserSeriesRequest request)
        {
            try
            {
                var userSeries = await _userSeriesService.GetUserSeriesList(userName, page, request.MyList, request.IsFavorite);
                return Results.Ok(userSeries);
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, "An unexpected error occurred while receiving this user's list.");
            }
        }

        /// <summary>
        /// Создает новую запись о просмотре аниме в списке пользователя.
        /// </summary>
        /// <param name="request">Данные для создания записи (AnimeId, CategoryId, WatchedEpisode, IsFavorite).</param>
        /// <returns>Результат выполнения запроса. Возвращает 201 Created в случае успеха, 401 Unauthorized, если пользователь не авторизован, или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [RequirePermission(Permission.Read)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Read'
        [HttpPost("create")]
        public async Task<IResult> CreateSeries([FromBody] CreateSeriesRequest request)
        {
            try
            {
                Guid userId = GetUserIdFromClaims();
                var createdSeriesId = await _userSeriesService.Create(
                    Guid.NewGuid(), userId, request.AnimeId, request.CategoryId,
                    request.WatchedEpisode, request.IsFavorite);

                return _logger.CreatedResponse(
                    logMessage: $"The user with ID:{userId} have added anime with ID:{request.AnimeId} to his list (id: {createdSeriesId}).",
                    resultMessage: "You have added anime to your list.");
            }
            catch (UnauthorizedAccessException)
            {
                return _logger.UnauthorizedResponse("You must be authorized to add anime to your list.", nameof(CreateSeries));
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, "An unexpected error occurred while adding anime to list.");
            }
        }

        /// <summary>
        /// Обновляет существующую запись о просмотре аниме в списке пользователя.
        /// </summary>
        /// <param name="id">ID записи, которую необходимо обновить.</param>
        /// <param name="request">Данные для обновления записи (WatchedEpisode, CategoryId, IsFavorite).</param>
        /// <returns>Результат выполнения запроса. Возвращает 204 No Content в случае успеха, 401 Unauthorized, если пользователь не авторизован, или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [RequirePermission(Permission.Read)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Read'
        [HttpPut("update/{id:guid}")]
        public async Task<IResult> UpdateSeries(Guid id, [FromBody] CreateSeriesRequest request)
        {
            try
            {
                // Получаем идентификатор пользователя из утверждений (claims)
                Guid userId = GetUserIdFromClaims();

                // Обновляем информацию о просмотренной серии через сервис
                var isUpdated = await _userSeriesService.UpdateSeries(id, request.WatchedEpisode,
                    request.CategoryId, request.IsFavorite);

                // Если обновление не произошло - выбрасываем исключение
                if (isUpdated == false)
                {
                    throw new Exception();
                }

                // Логируем информацию об успешном обновлении серии и возвращаем 204 No Content
                return _logger.NoContentResponse(
                    loggerMessage: $"The user with ID:{userId} have updated series with animeID:{request.AnimeId}.");
            }
            catch (UnauthorizedAccessException)
            {
                // Логируем информацию о неавторизованном доступе и возвращаем 401 Unauthorized
                return _logger.UnauthorizedResponse("You must be authorized to update series.", nameof(UpdateSeries));
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while updating series.");
            }
        }

        /// <summary>
        /// Удаляет запись о просмотре аниме из списка пользователя.
        /// </summary>
        /// <param name="id">ID записи, которую необходимо удалить.</param>
        /// <returns>Результат выполнения запроса. Возвращает 204 No Content в случае успеха, 401 Unauthorized, если пользователь не авторизован, или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [RequirePermission(Permission.Read)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Read'
        [HttpDelete("delete/{id:guid}")]
        public async Task<IResult> DeleteSeries(Guid id)
        {
            try
            {
                // Получаем идентификатор пользователя из утверждений (claims)
                Guid userId = GetUserIdFromClaims();

                // Удаляем серию из списка пользователя через сервис
                await _userSeriesService.DeleteSeries(id);

                // Логируем информацию об успешном удалении серии и возвращаем 204 No Content
                return _logger.NoContentResponse(
                    loggerMessage: $"The user with ID:{userId} have deleted series with ID:{id} from his list.");
            }
            catch (UnauthorizedAccessException)
            {
                // Логируем информацию о неавторизованном доступе и возвращаем 401 Unauthorized
                return _logger.UnauthorizedResponse("You must be authorized to delete series.", nameof(DeleteSeries));
            }
            catch (NotFoundException)
            {
                // Логируем информацию о том, что серия не найдена, и возвращаем 404 Not Found
                return _logger.NotFoundResponse($"Series with ID {id} not found.");
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while deleting series.");
            }
        }

        /// <summary>
        /// Удаляет все записи о просмотре аниме из списка пользователя.
        /// Требует разрешения Permission.Read.
        /// </summary>
        /// <param name="userName">Имя пользователя, для которого необходимо удалить все записи.</param>
        /// <returns>Результат выполнения запроса. Возвращает 204 No Content в случае успеха, 401 Unauthorized, если пользователь не авторизован, 
        /// 400 Bad Request, если валидация не прошла, или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [RequirePermission(Permission.Read)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Read'
        [HttpDelete("{userName}/deleteAll")]
        public async Task<IResult> DeleteAllSeries(string userName)
        {
            try
            {
                // Получаем идентификатор пользователя из имени пользователя
                Guid userId = GetUserIdFromClaims(userName);

                // Удаляем все записи о просмотре аниме для пользователя через сервис
                bool isDeleted = await _userSeriesService.DeleteAllSeries(userId);

                // Проверяем, были ли удалены какие-либо записи
                if (isDeleted == false)
                {
                    // Логируем информацию о том, что нечего было удалять и возвращаем 204 No Content
                    return _logger.NoContentResponse($"No series were found to delete for user with ID: {userId}.");
                }

                // Логируем информацию об успешном удалении всех записей и возвращаем 204 No Content
                return _logger.NoContentResponse(
                    loggerMessage: $"The user with ID:{userId} have deleted all series from his list.");
            }
            catch (UnauthorizedAccessException)
            {
                // Логируем информацию о неавторизованном доступе и возвращаем 401 Unauthorized
                return _logger.UnauthorizedResponse("You must be authorized to delete series.", nameof(DeleteAllSeries));
            }
            catch (ValidationException ex)
            {
                // Логируем ошибку валидации, возвращаем 400 Bad Request и сообщение об ошибке
                return _logger.BadResponse(
                    logMessage: $"User ({userName}) attempted to clear the list.",
                    resultMessage: "You cannot perform this action. You don't have rights.",
                    exeption: ex);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while deleting series.");
            }
        }

        /// <summary>
        /// Получает ID пользователя из claims и выполняет дополнительную валидацию имени пользователя.
        /// </summary>
        /// <param name="userName">Имя пользователя (опционально). Используется для валидации.</param>
        /// <returns>Guid ID пользователя.</returns>
        /// <exception cref="UnauthorizedAccessException">Выбрасывается, если ID пользователя не найден в claims.</exception>
        /// <exception cref="ValidationException">Выбрасывается, если имя пользователя в claims не соответствует переданному имени пользователя.</exception>
        private Guid GetUserIdFromClaims(string? userName = null)
        {
            // Получаем значение claim "userId" и "userName" из claims пользователя.
            var userClaims = new
            {
                UserID = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value,
                UserName = User.Claims.FirstOrDefault(c => c.Type == "userName")?.Value
            };

            // Если userId отсутствует - выбрасываем UnauthorizedAccessException.
            if (string.IsNullOrEmpty(userClaims.UserID))
            {
                throw new UnauthorizedAccessException("User ID not found in claims.");
            }

            if (!string.IsNullOrEmpty(userName)) // Если передано имя пользователя, выполняем валидацию.
            {
                if (!userName.Equals(userClaims.UserName, StringComparison.OrdinalIgnoreCase))
                {
                    throw new ValidationException($"User: {userName} failed validation.");
                }
            }

            // Проверяем, удалось ли преобразовать значение claim в Guid.
            if (Guid.TryParse(userClaims.UserID, out var userId))
            {
                // Если преобразование успешно, возвращаем ID пользователя.
                return userId;
            }

            // Если преобразование не удалось - выбрасываем UnauthorizedAccessException.
            throw new UnauthorizedAccessException("User ID not found in claims.");
        }
    }
}