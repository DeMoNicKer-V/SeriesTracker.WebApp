using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.API.Extensions;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Models;

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

        /// <summary>
        /// Проверяет, существует ли указанный email в системе.
        /// </summary>
        /// <param name="email">Email для проверки.</param>
        /// <returns>
        ///   Возвращает  `204 No Content`, если email не существует (свободен).
        ///   Возвращает  `400 Bad Request`, если email уже существует (занят).
        ///   Возвращает  `500 Internal Server Error`, если произошла непредвиденная ошибка.
        /// </returns>
        [HttpGet("email")] // Атрибут, определяющий маршрут для HTTP GET-запроса проверки email
        public async Task<IResult> CheckEmail(string email)
        {
            try
            {
                // Вызываем метод сервиса для проверки существования email
                bool emailExists = await _authenticationService.EmailExists(email);

                // Если email уже существует
                if (emailExists == false)
                {
                    // Логируем информацию о занятом email и возвращаем 400 Bad Request
                    return _logger.BadResponse(
                        logMessage: $"Attempt to create account with non-free Email: {email}",
                        resultMessage: "Адрес эл. почты уже используется.");
                }

                // Возвращаем 204 No Content, если email свободен
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                // Логируем общую ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(exception: ex, logMessage: "An unexpected error occurred while checking email.");
            }
        }

        /// <summary>
        /// Проверяет, существует ли указанный никнейм (userName) в системе.
        /// </summary>
        /// <param name="userName">Никнейм для проверки.</param>
        /// <returns>
        ///   Возвращает  `204 No Content`, если userName не существует (свободен).
        ///   Возвращает  `400 Bad Request`, если userName уже существует (занят).
        ///   Возвращает  `500 Internal Server Error`, если произошла непредвиденная ошибка.
        /// </returns>
        [HttpGet("userName")]
        public async Task<IResult> CheckUserName(string userName)
        {
            try
            {
                // Вызываем метод сервиса для проверки существования никнейма
                bool userNameExists = await _authenticationService.UserNameExists(userName);

                // Если никнейм уже существует
                if (userNameExists == false)
                {
                    // Логируем информацию о занятом никнейме и возвращаем 400 Bad Request
                    return _logger.BadResponse(
                        logMessage: $"Attempt to create account with non-free UserName: {userName}",
                        resultMessage: "Этот никнейм уже используется.");
                }

                // Возвращаем 204 No Content, если никнейм свободен
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                // Логируем общую ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(exception: ex, logMessage: "An unexpected error occurred while checking userName.");
            }
        }

        /// <summary>
        /// Аутентифицирует пользователя и возвращает токен.
        /// </summary>
        /// <param name="request">Запрос, содержащий email и пароль пользователя.</param>
        /// <returns>
        ///   Возвращает  `200 OK`  с токеном в случае успешной аутентификации.
        ///   Возвращает  `400 Bad Request`, если учетные данные неверны.
        ///   Возвращает  `500 Internal Server Error`, если произошла непредвиденная ошибка.
        /// </returns>
        [HttpPost("login")]
        public async Task<IResult> Login([FromBody] LoginUserRequest request)
        {
            try
            {
                // Вызываем метод сервиса для аутентификации пользователя и получения токена
                string token = await _authenticationService.Login(request.Email, request.Password);

                // Если токен не получен (неверные учетные данные)
                if (string.IsNullOrEmpty(token))
                {
                    // Логируем информацию о неудачной попытке входа и возвращаем 400 Bad Request
                    return _logger.BadResponse(
                        logMessage: $"Failed login attempt for email: {request.Email}",
                        resultMessage: "Неправильный адрес почты или пароль");
                }

                // Успешный вход: устанавливаем cookie и возвращаем токен
                Response.Cookies.Append("secretCookie", token, new CookieOptions // Добавляем токен в cookie
                {
                    HttpOnly = true, // Запрещаем доступ к cookie из JavaScript
                    Secure = true, // Cookie передается только по HTTPS
                    SameSite = SameSiteMode.Strict // Cookie отправляется только с запросами с того же сайта
                });

                // Возвращаем 200 OK с токеном
                return Results.Ok(token);
            }
            catch (Exception ex)
            {
                // Логируем общую ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(exception: ex, logMessage: "An unexpected error occurred while user login.");
            }
        }

        /// <summary>
        /// Выполняет выход пользователя из системы.
        /// </summary>
        /// <param name="userName">Имя пользователя, выполняющего выход.</param>
        /// <returns>
        ///   Возвращает  `204 No Content`  в случае успешного выхода.
        ///   Возвращает  `500 Internal Server Error`, если произошла непредвиденная ошибка.
        /// </returns>
        [HttpPost("logout/{userName}")] // Атрибут, определяющий маршрут для HTTP POST-запроса выхода пользователя
        public IResult Logout(string userName)
        {
            try
            {
                // Удаляем cookie с токеном
                Response.Cookies.Delete("secretCookie");

                // Логируем информацию об успешном выходе и возвращаем 204 No Content
                return _logger.NoContentResponse($"The user ({userName}) has successfully logged out.");
            }
            catch (Exception ex)
            {
                // Логируем общую ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(exception: ex, logMessage: "An unexpected error occurred while user logged out.");
            }
        }

        /// <summary>
        /// Регистрирует нового пользователя.
        /// </summary>
        /// <param name="request">Запрос, содержащий данные для регистрации пользователя.</param>
        /// <returns>
        ///   Возвращает  `204 No Content`  в случае успешной регистрации.
        ///   Возвращает  `400 Bad Request`, если данные не валидны.
        ///   Возвращает  `500 Internal Server Error`, если произошла непредвиденная ошибка.
        /// </returns>
        [HttpPost("register")] // Атрибут, указывающий, что это POST-запрос на эндпоинт /auth/register
        public async Task<IResult> Register([FromBody] UserRequest request)
        {
            // 1. Валидация входных данных (проверка на null и пустые строки)
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                // Если email пустой, возвращаем 400 Bad Request
                return _logger.BadResponse(
                    logMessage: "Attempt to sign up with empty or whitespace email.",
                    resultMessage: "Эл. почта не может быть пустой.");
            }
            if (string.IsNullOrWhiteSpace(request.UserName))
            {
                // Если никнейм пустой, возвращаем 400 Bad Request
                return _logger.BadResponse(
                    logMessage: "Attempt to sign up with empty or whitespace userName.",
                    resultMessage: "Никнейм не может быть пустым.");
            }
            if (string.IsNullOrWhiteSpace(request.Password))
            {
                // Если пароль пустой, возвращаем 400 Bad Request
                return _logger.BadResponse(
                    logMessage: "Attempt to sign up with empty or whitespace password.",
                    resultMessage: "Пароль не может быть пустым.");
            }

            try
            {
                // 2. Вызываем метод сервиса для регистрации пользователя
                await _authenticationService.Register(
                    request.UserName,
                    request.Email,
                    request.Password,
                    request.Avatar,
                    request.Name,
                    request.SurName,
                    request.DateBirth);

                // 3. Возвращаем 204 No Content в случае успешной регистрации
                return _logger.CreatedResponse($"/user/{request.UserName}", logMessage: $"User with email {request.Email} has been successfully registered.");
            }
            catch (Exception ex)
            {
                // 4. Обрабатываем непредвиденные ошибки
                // Логируем общую ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(
                    exception: ex,
                    logMessage: $"An unexpected error occurred while registration for email: {request.Email}");
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
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                // Логируем информацию о неавторизованном доступе и возвращаем 400 Bad Response
                return _logger.BadResponse(logMessage: "Incorrect verification data (email, password).",
                    resultMessage: "Эл. почта не может быть пустой.");
            }

            if (string.IsNullOrWhiteSpace(request.Password))
            {
                // Логируем информацию о неавторизованном доступе и возвращаем 400 Bad Response
                return _logger.BadResponse(logMessage: "Incorrect verification data (email, password).",
                    resultMessage: "Пароль не может быть пыстым.");
            }
            try
            {
                // Проверяем учетные данные через сервис аутентификации
                bool isVerified = await _authenticationService.Verify(request.Email, request.Password);

                // Если проверка успешна, возвращаем 200 OK с результатом (true)
                return _logger.NoContentResponse(logMessage: $"Successful login for user: {request.Email}");
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