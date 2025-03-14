using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;

using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions.UserAbastractions;

namespace SeriesTracker.API.Controllers
{

    [ApiController]
    [Route("auth")]
    public class AuthenticationController(IAuthenticationService authenticationService, ILogger<AuthenticationController> logger) : ControllerBase
    {
        private readonly Application.Services.IAuthenticationService _authenticationService = authenticationService;
        private readonly ILogger<AuthenticationController> _logger = logger;
    
        [HttpPost("verify")]
        public async Task<IResult> Verify([FromBody] LoginUserRequest request)
        {
            bool token = false;
            try
            {
                token = await _authenticationService.Verify(request.Email, request.Password);
            }
            catch (Exception)
            {
                return Results.BadRequest("Неверный пароль");
            }
            return Results.Ok(token);
        }

        [HttpPost("register")]
        public async Task<IResult> Register([FromBody] UserRequest userRequest)
        {
            try
            {
                await _authenticationService.Register(
                    userRequest.Email,
                    userRequest.Password,
                    userRequest.UserName,
                    userRequest.Avatar,
                    userRequest.Name,
                    userRequest.SurName,
                    userRequest.DateBirth
                );

                // Успешная регистрация:
                return Results.Ok(new { Message = "Регистрация прошла успешно." }); // Возвращаем JSON-объект с сообщением
            }
            catch (ArgumentException ex) // Пример: Обработка исключения, если что-то не так с данными
            {
                _logger.LogWarning(ex, $"Ошибка регистрации для email: {userRequest.Email}. Причина: {ex.Message}");
                return Results.BadRequest(new { Message = ex.Message }); // Возвращаем JSON-объект с сообщением об ошибке
            }
            catch (Exception ex) // Ловим все остальные исключения
            {
                _logger.LogError(ex, $"Непредвиденная ошибка регистрации для email: {userRequest.Email}");
                return Results.Json(new { Message = "Произошла непредвиденная ошибка. Попробуйте позже." }, statusCode: 500);
            }
        }

        [HttpPost("login")]
        public async Task<IResult> Login([FromBody] LoginUserRequest request)
        {
            try
            {
                string token = await _authenticationService.Login(request.Email, request.Password);

                // Успешный вход: устанавливаем cookie и возвращаем токен
                Response.Cookies.Append("secretCookie", token, new CookieOptions { HttpOnly = true, Secure = true });
                return Results.Ok(new { Token = token });
            }
            catch (ArgumentException ex) // Неверный email или пароль
            {
                _logger.LogWarning(ex, $"Неудачная попытка входа для email: {request.Email}.  Причина: {ex.Message}"); // Добавляем информацию об ошибке
                return Results.BadRequest(new { Message = ex.Message }); // Возвращаем JSON-объект с сообщением
            }
            catch (Exception ex) // Непредвиденная ошибка
            {
                _logger.LogError(ex, $"Непредвиденная ошибка входа для email: {request.Email}");
                return Results.Json(new { Message = "Произошла непредвиденная ошибка. Попробуйте позже." }, statusCode: 500);
            }
        }

        [HttpPost("logout")]
        public async Task<IResult> Logout()
        {
            try
            {
                await _authenticationService.Logout(HttpContext); //  Делегируем логику службе

                // Логируем выход пользователя
                _logger.LogInformation("Пользователь успешно вышел из системы.");

                return Results.Ok(new { Message = "Вы успешно вышли из системы." }); // Используем Ok()
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при выходе из системы.");
                return Results.Json(new { Message = "Произошла непредвиденная ошибка. Попробуйте позже." }, statusCode: 500);
            }
        }
    }
}
    