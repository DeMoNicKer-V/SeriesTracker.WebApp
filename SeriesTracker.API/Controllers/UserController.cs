using GraphQL;
using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Mappers;
using SeriesTracker.Core.Models.Shikimori;
using SeriesTracker.Infrastructure.Authentication;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController(IUserService userService, IUserSeriesService userSeriesService, IShikimoriService shikimoriService, ILogger<UserController> logger) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IUserSeriesService _userSeriesService = userSeriesService;
        private readonly IShikimoriService _shikimoriService = shikimoriService;
        private readonly ILogger<UserController> _logger = logger;

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
            var user = await _userService.GetUserByUserName(userName);
            if (user != null)
            {
                string passwordHash = string.IsNullOrEmpty(request.Password) ? string.Empty : _userService.HashPassword(request.Password);
                await _userService.UpdateUser(user.Id, request.UserName, request.Name, request.SurName, request.Email, passwordHash, request.Avatar, request.DateBirth);
                string token = await _userService.GenerateNewUserToken(request.UserName);
                Response.Cookies.Append("secretCookie", token, new CookieOptions { HttpOnly = true, Secure = true });
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

        [HttpGet("{usermame}/list")]
        public async Task<ActionResult<ShikimoriAnimeBaseList[]>> GetAnimesByUser(string usermame, [FromQuery] ShikimoriParamsRequest request, int mylist = 0)
        {
            string? userSeries = await _userSeriesService.GetSeriesAnimeIdsList(usermame, mylist);
            if (string.IsNullOrEmpty(userSeries))
            {
                return Ok(new List<ShikimoriAnimeBaseList>());
            }
            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse = await _shikimoriService.GetAnimesByAllParamsAndIds(request.Page, request.Name, userSeries, request.Season, request.Status,
                                                           request.Kind, request.Genre, request.Order, request.Censored);
            return new ObjectResult(graphQLResponse.Data.Animes);
        }
    }
}
