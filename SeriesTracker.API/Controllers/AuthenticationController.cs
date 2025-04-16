using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.API.Extensions;
using SeriesTracker.Application.Services;

namespace SeriesTracker.API.Controllers
{
    /// <summary>
    /// Контроллер для управления аутентификацией пользователей.
    /// </summary>
    [ApiController]
    [Route("auth")] // Атрибут, определяющий маршрут для контроллера
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ILogger<AuthenticationController> _logger;

        /// <summary>
        /// Инициализирует новый экземпляр класса AuthenticationController.
        /// </summary>
        /// <param name="authenticationService">Сервис для выполнения операций аутентификации.</param>
        /// <param name="logger">Логгер для записи информации о работе контроллера.</param>
        public AuthenticationController(IAuthenticationService authenticationService, ILogger<AuthenticationController> logger)
        {
            // Внедряем зависимость (Dependency Injection) сервиса аутентификации и проверяем на null.
            _authenticationService = authenticationService ?? throw new ArgumentNullException(nameof(authenticationService));

            // Внедряем зависимость (Dependency Injection) логгера и проверяем на null.
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <returns>
        ///   Возвращает  `204 No Content`, если email не существует.
        ///   Возвращает  `400 Bad Request`, если email уже существует.
        ///   Возвращает  `500 Internal Server Error`, если произошла непредвиденная ошибка.
        /// </returns>
        [HttpGet("email")]
        public async Task<IResult> CheckEmail(string email)
        {
            try
            {
                // Проверка email на существование
                bool emailExists = await _authenticationService.EmailExists(email);

                // Если email уже существует
                if (emailExists == true)
                {
                    // Логируем информацию о занятом email и возвращаем 400 Bad Response
                    return _logger.BadResponse(logMessage: $"Attempt to create account with non-free Email: {email}", resultMessage: "Адрес эл. почты уже используется.");
                }

                // Возвращаем 204 No Content
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                // Логируем общую ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(exception: ex, logMessage: "An unexpected error occurred while checking email.");
            }
        }

        /// <returns>
        ///   Возвращает  `204 No Content`, если userName не существует.
        ///   Возвращает  `400 Bad Request`, если userName уже существует.
        ///   Возвращает  `500 Internal Server Error`, если произошла непредвиденная ошибка.
        /// </returns>
        [HttpGet("userName")]
        public async Task<IResult> CheckUserName(string userName)
        {
            try
            {
                // Проверка userName на существование
                bool userNameExists = await _authenticationService.UserNameExists(userName);

                // Если userName уже существует
                if (userNameExists == true)
                {
                    // Логируем информацию о занятом userName и возвращаем 400 Bad Response
                    return _logger.BadResponse(logMessage: $"Attempt to create account with non-free UserName: {userName}", resultMessage: "Этот никнейм уже используется.");
                }

                // Возвращаем 204 No Content
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                // Логируем общую ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(exception: ex, logMessage: "An unexpected error occurred while checking userName.");
            }
        }

        [HttpPost("login")]
        public async Task<IResult> Login([FromBody] LoginUserRequest request)
        {
            try
            {
                string token = await _authenticationService.Login(request.Email, request.Password);

                // Успешный вход: устанавливаем cookie и возвращаем токен
                Response.Cookies.Append("secretCookie", token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict });
                return Results.Ok(new { Token = token });
            }
            catch (ArgumentException ex) // Неверный email или пароль
            {
                _logger.LogWarning(ex, $"Неудачная попытка входа для email: {request.Email}.  Причина: {ex.Message}"); // Добавляем информацию об ошибке
                return Results.BadRequest(new { ex.Message }); // Возвращаем JSON-объект с сообщением
            }
            catch (Exception ex) // Непредвиденная ошибка
            {
                _logger.LogError(ex, $"Непредвиденная ошибка входа для email: {request.Email}");
                return Results.Json(new { Message = "Произошла непредвиденная ошибка. Попробуйте позже." }, statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost("logout")]
        public IResult Logout()
        {
            try
            {
                Response.Cookies.Delete("secretCookie"); // Удаляем cookie

                // Логируем выход пользователя
                _logger.LogInformation("Пользователь успешно вышел из системы.");

                return Results.Ok(new { Message = "Вы успешно вышли из системы." }); // Используем Ok()
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при выходе из системы.");
                return Results.Json(new { Message = "Произошла непредвиденная ошибка. Попробуйте позже." }, statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost("register")]
        public async Task<IResult> Register([FromBody] UserRequest request)
        {
            try
            {
                await _authenticationService.Register(
                    request.Email,
                    request.Password,
                    request.UserName,
                    request.Avatar,
                    request.Name,
                    request.SurName,
                    request.DateBirth);

                // Успешная регистрация:
                return Results.Ok(new { Message = "Регистрация прошла успешно." }); // Возвращаем JSON-объект с сообщением
            }
            catch (ArgumentException ex) // Пример: Обработка исключения, если что-то не так с данными
            {
                _logger.LogWarning(ex, $"Ошибка регистрации для email: {request.Email}. Причина: {ex.Message}");
                return Results.BadRequest(new { ex.Message }); // Возвращаем JSON-объект с сообщением об ошибке
            }
            catch (Exception ex) // Ловим все остальные исключения
            {
                _logger.LogError(ex, $"Непредвиденная ошибка регистрации для email: {request.Email}");
                return Results.Json(new { Message = "Произошла непредвиденная ошибка. Попробуйте позже." }, statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        /// <summary>
        /// Проверяет учетные данные пользователя (email и пароль) и выполняет аутентификацию.
        /// </summary>
        /// <param name="request">Объект, содержащий email и пароль для аутентификации.</param>
        /// <returns>
        ///   Возвращает  `200 OK`  с  `true`, если аутентификация успешна.
        ///   Возвращает  `400 Bad Request`, если предоставлены некорректные данные (неверный формат email,  пустой пароль и т.д.).
        ///   Возвращает  `401 Unauthorized`, если аутентификация не удалась (неверный email или пароль).
        ///   Возвращает  `500 Internal Server Error`, если произошла непредвиденная ошибка.
        /// </returns>
        [HttpPost("verify")]
        public async Task<IResult> Verify([FromBody] LoginUserRequest request)
        {
            try
            {
                // Проверяем учетные данные через сервис аутентификации
                bool isVerified = await _authenticationService.Verify(request.Email, request.Password);

                // Если проверка успешна, возвращаем 200 OK с результатом (true)
                return Results.Ok(isVerified);
            }
            catch (ArgumentException ex)
            {
                // Логируем информацию о неавторизованном доступе и возвращаем 400 Bad Response
                return _logger.BadResponse(logMessage: "Incorrect verification data (email, password).", resultMessage: ex.Message, exeption: ex);
            }
            catch (UnauthorizedAccessException ex)
            {
                // Логируем информацию о неавторизованном доступе и возвращаем 401 Unauthorized
                return _logger.UnauthorizedResponse(resultMessage: ex.Message, methodName: nameof(Verify));
            }
            catch (Exception ex)
            {
                // Логируем общую ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(exception: ex, logMessage: "An unexpected error occurred while user verifying.");
            }
        }
    }
}