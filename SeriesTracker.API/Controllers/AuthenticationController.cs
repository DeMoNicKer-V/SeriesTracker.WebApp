using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Services;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthenticationController(IAuthenticationService authenticationService, ILogger<AuthenticationController> logger) : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService = authenticationService;
        private readonly ILogger<AuthenticationController> _logger = logger;

        [HttpPost("verify")]
        public async Task<IResult> Verify([FromBody] LoginUserRequest request)
        {
            try
            {
                bool token = await _authenticationService.Verify(request.Email, request.Password);
                return Results.Ok(token);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { ex.Message });
            }
            catch (UnauthorizedAccessException)
            {
                return Results.BadRequest(new {Message =  "Неверный пароль"});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка верификации пользователя");
                return Results.StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet("email")]
        public async Task<IResult> CheckEmail(string email)
        {
            bool emailExists = await _authenticationService.EmailExists(email);

            if (emailExists)
            {
                return Results.BadRequest(new { Message = "Адрес эл. почты уже используется" });
            }

            return Results.Ok(new { }); // Email свободен
        }

        [HttpGet("userName")]
        public async Task<IResult> CheckUserName(string userName)
        {
            bool userNameExists = await _authenticationService.UserNameExists(userName);

            if (userNameExists)
            {
                return Results.BadRequest(new { Message = "Этот логин уже используется" });
            }

            return Results.Ok(new { }); // UserName свободен
        }

        [HttpPost("register")]
        public async Task<IResult> Register([FromBody] UserRequest userRequest)
        {
            try
            {
                await _authenticationService.Register(
                    email: userRequest.Email,
                    password: userRequest.Password,
                    userName: userRequest.UserName,
                    avatar: userRequest.Avatar,
                    name: userRequest.Name,
                    surName: userRequest.SurName,
                    dateBirth: userRequest.DateBirth);

                // Успешная регистрация:
                return Results.Ok(new { Message = "Регистрация прошла успешно." }); // Возвращаем JSON-объект с сообщением
            }
            catch (ArgumentException ex) // Пример: Обработка исключения, если что-то не так с данными
            {
                _logger.LogWarning(ex, $"Ошибка регистрации для email: {userRequest.Email}. Причина: {ex.Message}");
                return Results.BadRequest(new { ex.Message }); // Возвращаем JSON-объект с сообщением об ошибке
            }
            catch (Exception ex) // Ловим все остальные исключения
            {
                _logger.LogError(ex, $"Непредвиденная ошибка регистрации для email: {userRequest.Email}");
                return Results.Json(new { Message = "Произошла непредвиденная ошибка. Попробуйте позже." }, statusCode: StatusCodes.Status500InternalServerError);
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
        public async Task<IResult> Logout()
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
    }
}