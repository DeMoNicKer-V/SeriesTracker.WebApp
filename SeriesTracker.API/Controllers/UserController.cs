using GraphQL;
using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Mappers;
using SeriesTracker.Infrastructure.Authentication;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController(IUserService userService, IUserSeriesService userSeriesService, ILogger<UserController> logger) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IUserSeriesService _userSeriesService = userSeriesService;
        private readonly ILogger<UserController> _logger = logger;

        [HttpGet("id/{id:guid}")]
        public async Task<IResult> GetUserById(Guid id)
        {
            var user = await _userService.GetUserById(id);
            return Results.Ok(user.ToDetailDTO());
        }

        [HttpGet("{page:int}")]
        public async Task<IResult> GetUsersList(int page = 1)
        {
            var (userList, totalCount) = await _userService.GetUserList(page);
            return Results.Ok(new { users = userList, totalCount });
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
            try
            {
                var user = await _userService.GetUserByUserName(userName);
                if (user != null)
                {
                    string passwordHash = string.IsNullOrEmpty(request.Password) ? string.Empty : _userService.HashPassword(request.Password);
                    await _userService.UpdateUser(user.Id, request.UserName, request.Name, request.SurName, request.Email, passwordHash, request.Avatar, request.DateBirth);
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
        [HttpDelete("deleteUser/{userName}")]
        public async Task<IResult> DeleteUserByUserName(string userName)
        {
            var userId = await _userService.GetUserIdByEmail(userName);
            if (userId == null)
            {
                return Results.NotFound($"User with userName '{userName}' not found.");
            }

            await _userService.DeleteUser(userId.Value);
            Response.Cookies.Delete("secretCookie");
            return Results.Ok();
        }

        [RequirePermission(Permission.Read)]
        [HttpDelete("deleteSelf/{userName}")]
        public async Task<IResult> DeleteSelfAccount(string userName)
        {
            var userId = await _userService.GetUserIdByUserName(userName);
            if (userId == null)
            {
                return Results.NotFound($"User with userName '{userName}' not found.");
            }

            await _userService.DeleteUser(userId.Value);
            Response.Cookies.Delete("secretCookie");
            return Results.Ok();
        }
       
    }
}
