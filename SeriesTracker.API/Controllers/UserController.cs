using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Mappers;
using SeriesTracker.Infrastructure.Authentication;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController(IUserService userService, IUserSeriesService userSeriesService, ICategoryService categoryService, ILogger<UserController> logger) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IUserSeriesService _userSeriesService = userSeriesService;
        private readonly ILogger<UserController> _logger = logger; // Внедряем ILogger<UserService>

        [HttpGet("id/{id}")]
        public async Task<IResult> GetUserById(Guid id)
        {
            var user = await _userService.GetUserById(id);
            return Results.Ok(user.ToDetailDTO());
        }

        [HttpGet]
        public async Task<IResult> GetUserList()
        {
            var userList = await _userService.GetUserList();
            return Results.Ok(userList.Select(user => user.ToDTO()));
        }

        [HttpGet("userName/{userName}")]
        public async Task<IResult> GetUserInfoByUserName(string userName)
        {
            var user = await _userService.GetUserByUserName(userName);
            if (user == null)
            {
                return Results.BadRequest("Такого пользователя не существует");
            }

            var categoryGroup = await _userSeriesService.GetGroupSeries(user.Id);

            var lastActivityList = await _userSeriesService.GetRecentSeriesString(user.Id);

            return Results.Ok(user.ToUserActivityDto(categoryGroup, lastActivityList));
        }

        [HttpGet("categoryCount")]
        public async Task<IResult> GetCategoriesSeriesCount(string userName)
        {

            var userId = await _userService.GetUserIdByUserName(userName);
            var categoryGroup = await _userSeriesService.GetGroupShortSeries(userId.Value);
            return Results.Ok(categoryGroup);
        }

        [HttpPost("register")]
        public async Task<IResult> Register([FromBody] UserRequest userRequest)
        {
            try
            {
                await _userService.Register(
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

        [HttpGet("email")]
        public async Task<IResult> CheckEmail(string email)
        {
            var userId = await _userService.GetUserIdByEmail(email);
            if (userId != Guid.Empty)
            {
                return Results.BadRequest("Адрес эл. почты уже занят");
            }
            return Results.Ok();
        }

        [HttpGet("userName")]
        public async Task<IResult> CheckUserName(string userName)
        {
            var userId = await _userService.GetUserIdByUserName(userName);
            if (userId != Guid.Empty)
            {
                return Results.BadRequest("Данный никнейм уже занят");
            }
            return Results.Ok();
        }

        [RequirePermission(Permission.Read)]
        [HttpDelete("deleteSeries/{userName}")]
        public async Task<IResult> DeleteAllSeriesByUserName(string userName)
        {
            var userId = await _userService.GetUserIdByUserName(userName);
            if (userId != Guid.Empty)
            {
                var user = await _userService.GetUserByUserName(userName);
                await _userSeriesService.DeleteAllSeriesByUserId(user.Id);
            }

            return Results.Ok();
        }

        [RequirePermission(Permission.Read)]
        [HttpPut("update/{userName}")]
        public async Task<IResult> UpdateUser(string userName, [FromBody] UserRequest request)
        {
            var userId = await _userService.GetUserIdByUserName(userName);
            if (userId != null)
            {
                var user = await _userService.GetUserByUserName(userName);
                string passwordHash = string.IsNullOrEmpty(request.Password) ? string.Empty : _userService.HashPassword(request.Password);
                await _userService.UpdateUser(user.Id, request.UserName, request.Name, request.SurName, request.Email, passwordHash, request.Avatar, request.DateBirth);
                return Results.Ok();
            }

            return Results.BadRequest();
        }

        [RequirePermission(Permission.Update)]
        [HttpPut("changeUserRole/{id}")]
        public async Task<IResult> ChangeUserRole(Guid id, [FromBody] int roleId)
        {
            await _userService.ChangeUserRole(id, roleId);
            return Results.Ok();
        }

        [RequirePermission(Permission.Delete)]
        [HttpDelete("deleteUser/{userName}")]
        public async Task<IResult> DeleteUserByUserName(string userName)
        {
            var userId = await _userService.GetUserIdByEmail(userName);
            if (userId == null)
            {
                return Results.NotFound($"User with userName '{userName}' not found.");
            }

            await _userService.DeleteUser(userId.Value);
            return Results.Ok();
        }

        [RequirePermission(Permission.Read)]
        [HttpDelete("deleteSelf/{userName}")]
        public async Task<IResult> DeleteSelfAccount(string userName)
        {
            var userId = await _userService.GetUserIdByEmail(userName);
            if (userId == null)
            {
                return Results.NotFound($"User with userName '{userName}' not found.");
            }

            await _userService.DeleteUser(userId.Value);
            return Results.Ok();
        }

        [HttpPost("verify")]
        public async Task<IResult> Verify([FromBody] LoginUserRequest request)
        {
            bool token = false;
            try
            {
                token = await _userService.Verify(request.Email, request.Password);
            }
            catch (Exception)
            {
                return Results.BadRequest("Неверный пароль");
            }
            return Results.Ok(token);
        }

        [HttpPost("login")]
        public async Task<IResult> Login([FromBody] LoginUserRequest request)
        {
            try
            {
                string token = await _userService.Login(request.Email, request.Password);

                // Успешный вход: устанавливаем cookie и возвращаем токен
                Response.Cookies.Append("secretCookie", token, new CookieOptions { HttpOnly = true, Secure = true });
                return Results.Ok(new { Token = token }); //  Но лучше вернуть JSON-объект
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
    }
}
