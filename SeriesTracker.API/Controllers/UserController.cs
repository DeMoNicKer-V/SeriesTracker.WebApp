using GraphQL;
using GraphQLParser;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Abstractions.UserAbastractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController(IUserService userService, IUserSeriesService userSeriesService, ICategoryService categoryService) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly ICategoryService _categoryService = categoryService;
        private readonly IUserSeriesService _userSeriesService = userSeriesService;

        [HttpGet("id/{id}")]
        public async Task<IResult> GetUserById(Guid id)
        {
            var permissions = await _userService.GetUserPermissions(id);
            var user = await _userService.GetUserById(id);
            var userResponse = new UserResponse(user.Email, user.PasswordHash,
                user.UserName, user.Avatar, user.Name, user.Surname, user.DateOfBirth, permissions);
            return Results.Ok(userResponse);
        }

        [HttpGet]
        public async Task<IResult> GetUserList()
        {
            var userList = await _userService.GetUserList();
            return Results.Ok(userList);
        }

        [HttpGet("username/{username}")]
        public async Task<IResult> GetUserInfoByUserName(string username)
        {
            var categoryList = await _categoryService.GetCategoryList();
            var user = await _userService.GetUserByUserName(username);
            var seriesList = await _userSeriesService.GetSeriesList(user.Id.ToString());
            var categoryGroup = seriesList
              .GroupBy(s => s.CategoryId)
              .Join(categoryList,
                  g => g.Key,
                  c => c.Id,
                  (g, c) => new { Id = c.Id, Name = c.Name, Color = c.Color, SeriesCount = g.Count() })
              .ToList();
            var lastActivityList = seriesList.OrderByDescending(s => s.ChangedDate).Take(4).Select(s => s.AnimeId).ToList();
            var userResponse = new DefaultUserResponse(user.Email, user.PasswordHash,
                user.UserName, user.Avatar, user.Name, user.Surname, user.DateOfBirth, user.RegistrationDate, !string.IsNullOrEmpty(user.DateOfBirth) ? (int)(DateTime.Now - DateTime.Parse(user.DateOfBirth)).TotalDays /365 : 0);
            
            return Results.Ok(new {UserInfo = userResponse, SeriesInfo = categoryGroup, ActivityInfo = lastActivityList});
        }

        [HttpGet("categoryCount")]
        public async Task<IResult> GetCategoriesSeriesCount(string username)
        {
            var categoryList = await _categoryService.GetCategoryList();
            var user = await _userService.GetUserByUserName(username);
            var seriesList = await _userSeriesService.GetSeriesList(user.Id.ToString());

            var categoryGroup = seriesList
              .GroupBy(s => s.CategoryId)
              .Join(categoryList,
                  g => g.Key,
                  c => c.Id,
                  (g, c) => new { Key = c.Id.ToString(), Value = g.Count() })
              .ToList();
            var allSeries = new { Key = 0.ToString(), Value = seriesList.Count };
            categoryGroup.Insert(0,allSeries);

            return Results.Ok(categoryGroup);
        }

        [HttpPost("register")]
        public async Task<IResult> Register([FromBody] UserRequest userRequest)
        {
            await _userService.Register(userRequest.Email, userRequest.Password, userRequest.UserName, userRequest.Avatar, userRequest.Name, userRequest.SurName, userRequest.DateBirth);
            return Results.Ok();
        }

        [HttpGet("email")]
        public async Task<IResult> CheckEmail(string email)
        {
            var user = await _userService.CheckUsersEmail(email);
            if (user == true)
            {
                return Results.BadRequest("Адрес эл. почты уже занят");
            }
            return Results.Ok();
        }

        [HttpGet("username")]
        public async Task<IResult> CheckUserName(string userName)
        {
            var user = await _userService.CheckUsersUserName(userName);
            if (user == true)
            {
                return Results.BadRequest("Данный никнейм уже занят");
            }
            return Results.Ok();
        }

        [RequirePermission(Permission.Read)]
        [HttpDelete("deleteSeries/{username}")]
        public async Task<IResult> DeleteAllSeriesByUsername(string username)
        {
            var checkUser = await _userService.CheckUsersUserName(username);
            if (checkUser == true)
            {
                var user = await _userService.GetUserByUserName(username);
                await _userSeriesService.DeleteAllSeriesByUserId(user.Id);
            }

            return Results.Ok();
        }

        [RequirePermission(Permission.Read)]
        [HttpPut("update/{username}")]
        public async Task<IResult> UpdateUser(string username, [FromBody] UserRequest request)
        {
            var checkUser = await _userService.CheckUsersUserName(username);
            if (checkUser == true)
            {
                var user = await _userService.GetUserByUserName(username);
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

        [RequirePermission(Permission.Read)]
        [HttpDelete("deleteUser/{username}")]
        public async Task<IResult> DeleteUserByUsername(string username)
        {
            var checkUser = await _userService.CheckUsersUserName(username);
            if (checkUser == true)
            {
                var user = await _userService.GetUserByUserName(username);
                await _userService.DeleteUser(user.Id);
                Response.Cookies.Delete("secretCookie");
            }

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
            string token = string.Empty;
            try
            {
                token = await _userService.Login(request.Email, request.Password);
            }
            catch (Exception)
            {
                return Results.BadRequest("Неправильный адрес почты или пароль");
            }
            Response.Cookies.Append("secretCookie", token);
            return Results.Ok(token);
        }
    }
}
