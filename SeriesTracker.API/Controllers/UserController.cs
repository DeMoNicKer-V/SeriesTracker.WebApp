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

        [HttpPost("register")]
        public async Task<IResult> Register([FromBody] UserRequest userRequest)
        {
            await _userService.Register(userRequest.Email, userRequest.Password, "", "", "", "", "");
            return Results.Ok();
        }

        [HttpPost("login")]
        public async Task<IResult> Login([FromBody] LoginUserRequest request)
        {
            var token = await _userService.Login(request.Email, request.Password);
            Response.Cookies.Append("current-theme-cookie", token);
            return Results.Ok(token);
        }
    }
}
