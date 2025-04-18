using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.API.Extensions;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;
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
        /// Создает новую запись о просмотре аниме в списке пользователя.
        /// </summary>
        /// <param name="request">Данные для создания записи (AnimeId, CategoryId, WatchedEpisode, IsFavorite).</param>
        /// <returns>Результат выполнения запроса. Возвращает 201 Created в случае успеха,
        /// 401 Unauthorized, если пользователь не авторизован,
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [RequirePermission(Permission.Add)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Add'
        [HttpPost("create")]
        public async Task<IResult> CreateSeries([FromBody] CreateSeriesRequest request)
        {
            try
            {
                // Получаем идентификатор пользователя из утверждений (claims)
                Guid userId = GetUserIdFromClaims();

                // Создаем новую запись о просмотре аниме для пользователя через сервис
                var createdSeriesId = await _userSeriesService.Create(
                    Guid.NewGuid(), userId, request.AnimeId, request.CategoryId,
                    request.WatchedEpisode, request.IsFavorite);

                // Логируем информацию об успешном создании записи и возвращаем 201 Created
                return _logger.CreatedResponse(
                    logMessage: $"The user with ID:{userId} has added anime with ID:{request.AnimeId} to his list (id: {createdSeriesId}).",
                    resultMessage: "You have added anime to your list.");
            }
            catch (UnauthorizedAccessException)
            {
                // Логируем информацию о неавторизованном доступе и возвращаем 401 Unauthorized
                return _logger.UnauthorizedResponse("You must be authorized to add anime to your list.", nameof(CreateSeries));
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while adding anime to list.");
            }
        }

        /// <summary>
        /// Удаляет все записи о просмотре аниме из списка пользователя.
        /// Требует разрешения Permission.Read.
        /// </summary>
        /// <param name="userName">Имя пользователя, для которого необходимо удалить все записи.</param>
        /// <returns>Результат выполнения запроса. Возвращает 204 No Content в случае успеха,
        /// 401 Unauthorized, если пользователь не авторизован,
        /// 400 Bad Request, если валидация не прошла,
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [RequirePermission(Permission.Update)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Update'
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
                    logMessage: $"The user with ID:{userId} has deleted all series from his list.");
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
        /// Удаляет запись о просмотре аниме из списка пользователя.
        /// </summary>
        /// <param name="id">ID записи, которую необходимо удалить.</param>
        /// <returns>Результат выполнения запроса. Возвращает 204 No Content в случае успеха,
        /// 401 Unauthorized, если пользователь не авторизован,
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [RequirePermission(Permission.Update)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Update'
        [HttpDelete("delete/{id:guid}")]
        public async Task<IResult> DeleteSeries(Guid id)
        {
            try
            {
                // Получаем идентификатор пользователя из утверждений (claims)
                Guid userId = GetUserIdFromClaims();

                // Удаляем аниме из списка пользователя через сервис
                bool isDeleted = await _userSeriesService.DeleteSeries(id);

                // Проверяем, были ли удалены какие-либо записи
                if (isDeleted == false)
                {
                    // Логируем информацию о том, что аниме в списках не найдено, и возвращаем 404 Not Found
                    return _logger.NotFoundResponse($"Series with ID {id} not found.");
                }

                // Логируем информацию об успешном удалении аниме из спика и возвращаем 204 No Content
                return _logger.NoContentResponse(
                    logMessage: $"The user with ID:{userId} has deleted series with ID:{id} from his list.");
            }
            catch (UnauthorizedAccessException)
            {
                // Логируем информацию о неавторизованном доступе и возвращаем 401 Unauthorized
                return _logger.UnauthorizedResponse("You must be authorized to delete series.", nameof(DeleteSeries));
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while deleting series.");
            }
        }

        /// <summary>
        /// Получает список аниме пользователя с учетом параметров запроса.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <param name="page">Номер страницы списка.</param>
        /// <param name="request">Параметры запроса для фильтрации списка аниме.</param>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK со списком аниме
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("{userName}/list/{page}")]
        public async Task<IResult> GetAnimesByUser(string userName, int page, [FromQuery] UserSeriesRequest request)
        {
            try
            {
                // Получаем список аниме пользователя с учетом пагинации и фильтров из сервиса
                var userSeries = await _userSeriesService.GetUserSeriesList(userName, page, request.MyList, request.IsFavorite);

                // Возвращаем список аниме пользователя с кодом 200 OK
                return Results.Ok(userSeries);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while receiving this user's list.");
            }
        }

        /// <summary>
        /// Получает сгруппированный список аниме пользователя по категориям.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK со сгруппированным списком аниме
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("{userName}/group")]
        public async Task<IResult> GetGroupSeries(string userName)
        {
            try
            {
                // Получаем сгруппированный по категориям список аниме пользователя из сервиса
                var categoryGroup = await _userSeriesService.GetGroupShortSeries(userName);

                // Возвращаем сгруппированный список аниме пользователя с кодом 200 OK
                return Results.Ok(categoryGroup);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while receiving this user's list.");
            }
        }

        /// <summary>
        /// Получает информацию о профиле пользователя.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK с данными профиля пользователя,
        /// 404 Not Found, если пользователь не найден,
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("{userName}")]
        public async Task<IResult> GetUserProfileInfo(string userName)
        {
            try
            {
                // Получаем информацию о профиле пользователя из сервиса
                var userProfileInfo = await _userSeriesService.GetUserProfile(userName);

                // Проверяем, был ли найден профиль пользователя
                if (userProfileInfo == null)
                {
                    // Логируем информацию о том, что пользователь не найден, и возвращаем 404 Not Found
                    return _logger.NotFoundResponse(message: $"User ({userName}) not found");
                }

                // Возвращаем информацию о профиле пользователя с кодом 200 OK
                return Results.Ok(userProfileInfo);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(exception: ex, logMessage: "An unexpected error occurred while getting user's profile");
            }
        }

        /// <summary>
        /// Обновляет существующую запись о просмотре аниме в списке пользователя.
        /// </summary>
        /// <param name="id">ID записи, которую необходимо обновить.</param>
        /// <param name="request">Данные для обновления записи (WatchedEpisode, CategoryId, IsFavorite).</param>
        /// <returns>Результат выполнения запроса. Возвращает 204 No Content в случае успеха,
        /// 401 Unauthorized, если пользователь не авторизован,
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [RequirePermission(Permission.Update)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Update'
        [HttpPut("update/{id:guid}")]
        public async Task<IResult> UpdateSeries(Guid id, [FromBody] CreateSeriesRequest request)
        {
            try
            {
                // Получаем идентификатор пользователя из утверждений (claims)
                Guid userId = GetUserIdFromClaims();

                // Обновляем информацию об аниме в списке пользователя через сервис
                var isUpdated = await _userSeriesService.UpdateSeries(id, request.WatchedEpisode,
                    request.CategoryId, request.IsFavorite);

                // Проверяем, были ли изменены какие-либо записи
                if (isUpdated == false)
                {
                    // Логируем информацию о том, что аниме в списках не найдено, и возвращаем 404 Not Found
                    return _logger.NotFoundResponse($"Series with ID {id} not found.");
                }

                // Логируем информацию об успешном обновлении аниме в списке пользователя и возвращаем 204 No Content
                return _logger.NoContentResponse(
                    logMessage: $"The user with ID:{userId} has updated series with animeID:{request.AnimeId}.");
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