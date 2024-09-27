using GraphQLParser;
using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Abstractions.UserAbastractions;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController :ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("id/{id}")]
        public async Task<IResult> GetUserById(Guid id)
        {
            var permissions = await _userService.GetUserPermissions(id);
            var user = await _userService.GetUserById(id);
            var userResponse = new UserResponse(user.Email, user.PasswordHash,
                user.UserName, user.Avatar, user.Name, user.Surname, user.DateOfBirth, permissions);
            return Results.Ok(userResponse);
        }

        [HttpGet("username/{username}")]
        public async Task<IResult> GetUserByUserName(string username)
        {
            var user = await _userService.GetUserByUserName(username);
            var userResponse = new DefaultUserResponse(user.Email, user.PasswordHash,
                user.UserName, user.Avatar, user.Name, user.Surname, user.DateOfBirth, user.RegistrationDate, !string.IsNullOrEmpty(user.DateOfBirth) ? (int)(DateTime.Now - DateTime.Parse(user.DateOfBirth)).TotalDays /365 : 0);
            return Results.Ok(userResponse);
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
