using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.API.Extensions;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Infrastructure.Authentication;

namespace SeriesTracker.API.Controllers
{
    /// <summary>
    /// Контроллер для работы с пользователями.
    /// Предоставляет методы для работы с пользователями (CRUD).
    /// </summary>
    [ApiController]
    [Route("user")] // Атрибут, определяющий маршрут для контроллера
    public class UserController(IUserService userService, ILogger<UserController> logger) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly ILogger<UserController> _logger = logger;

        [HttpGet("id/{id:guid}")]
        public async Task<IResult> GetUserById(Guid id)
        {
            try
            {
                var user = await _userService.GetUserById(id);

                if (user == null)
                {
                    _logger.NotFoundResponse("The user not found.");
                }
                return Results.Ok(user);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error while getting user.");
            }
        }

        [HttpGet("{page:int}")]
        public async Task<IResult> GetUsersList(int page = 1)
        {
            try
            {
                var (userList, totalCount) = await _userService.GetUserList(page);
                return Results.Ok(new { users = userList, totalCount });
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error while getting user.");
            }
        }

        [RequirePermission(Permission.Read)]
        [HttpPut("update/{userName}")]
        public async Task<IResult> UpdateUser(string userName, [FromBody] UserRequest request)
        {
            try
            {
                var user = await _userService.GetUserByUserName(userName);
                if (user != null)
                {
                    var isUpdated = await _userService.UpdateUser(
                        user.Id, 
                        request.UserName, 
                        request.Name, 
                        request.SurName, 
                        request.Email, 
                        request.Password, 
                        request.Avatar, 
                        request.DateBirth);

                    string token = await _userService.GenerateNewUserToken(request.UserName);
                    Response.Cookies.Append("secretCookie", token, new CookieOptions { HttpOnly = true, Secure = true });
                    return Results.Ok();
                }
                return Results.BadRequest(new { Message = "Пользователь не найден" });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { Message = ex.Message });
            }
        }

        [RequirePermission(Permission.Update)]
        [HttpPut("changeRole/{id}")]
        public async Task<IResult> ChangeUserRole(Guid id, [FromBody] int roleId)
        {
            try
            {
                bool success = await _userService.ChangeUserRole(id, roleId);

                if (!success)
                {
                    return Results.NotFound($"Пользователь с ID '{id}' или роль с '{roleId}' не найдены");
                }

                return Results.NoContent();
            }
            catch (Exception ex)
            {
                // Логирование непредвиденной ошибки
                _logger.LogError(ex, "Ошибка при изменении роли пользователя. userId - {userId}; roleId - {roleId}", id, roleId);
                return Results.BadRequest(ex.Message);
            }
        }

        [RequirePermission(Permission.Delete)]
        [HttpDelete("{userName}/delete")]
        public async Task<IResult> DeleteUserByUserName(string userName)
        {
            var user = await _userService.GetUserByUserName(userName);
            if (user == null)
            {
                return Results.NotFound($"User with userName '{userName}' not found.");
            }

            await _userService.DeleteUser(user.Id);
            Response.Cookies.Delete("secretCookie");
            return Results.Ok();
        }

        [RequirePermission(Permission.Read)]
        [HttpDelete("{userName}/deleteSelf")]
        public async Task<IResult> DeleteSelfAccount(string userName)
        {
            var user = await _userService.GetUserByUserName(userName);
            if (user == null)
            {
                return Results.NotFound($"User with userName '{userName}' not found.");
            }

            await _userService.DeleteUser(user.Id);
            Response.Cookies.Delete("secretCookie");
            return Results.Ok();
        }
    }
}