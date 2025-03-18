using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;
using SeriesTracker.Infrastructure.Authentication;
using System.Security.Claims;


namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("series")]
    public class SeriesController : ControllerBase
    {
        private readonly ISeriesService _seriesService;
        private readonly IUserSeriesService _userSeriesService;
        private readonly ICategoryService _categoryService;
        private readonly IJwtProvider _jwtProvider;

        public SeriesController(ISeriesService seriesService,
            ICategoryService categoryService,
            IUserSeriesService userSeriesService,
            IJwtProvider jwtProvider)
        {
            _seriesService = seriesService;
            _categoryService = categoryService;
            _userSeriesService = userSeriesService;
            _jwtProvider = jwtProvider;
        }

        [HttpGet]
        public async Task<ActionResult<int>> GetAllSeriesCount()
        {
            var seriesCount = await _seriesService.GetAllSeriesCount();
            return Ok(seriesCount);
        }


        [HttpGet("id/{id}")]
        public async Task<ActionResult<int>> GetSeriesById(Guid id)
        {
            var s = await _seriesService.GetSeriesById(id);

            var response = new SeriesResponse(s.Id, s.AnimeId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.CategoryId, s.IsFavorite);

            return Ok(response);
        }



        [RequirePermission(Permission.Read)]
        [HttpPost("create")]
        public async Task<ActionResult<Guid>> CreateSeries([FromBody] CreateSeriesRequest request)
        {
            var token = Request.Cookies["secretCookie"];

            // Проверка наличия токена
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized();
            }
            var principal = _jwtProvider.ValidateToken(token);
            var userId = principal.FindFirstValue("userId");
            var date = DateTime.Now.ToString("s");
            var (series, error) = UserSeries.Create(Guid.NewGuid(), request.AnimeId, Guid.Parse(userId), request.CategoryId, request.WatchedEpisode, date, date, request.IsFavorite);

            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            var seriesId = await _userSeriesService.CreateAsync(series);
            return Ok(seriesId);
        }


        [RequirePermission(Permission.Read)]
        [HttpPut("update/{id:guid}")]
        public async Task<ActionResult<Guid>> UpdateSeries(Guid id, [FromBody] SeriesRequest request)
        {
            var date = DateTime.Now.ToString("s");
            var seriesId = await _userSeriesService.UpdateSeries(id, request.WatchedEpisode,
               date, request.CategoryId, request.IsFavorite);
            return Ok(seriesId);
        }


        [RequirePermission(Permission.Read)]
        [HttpDelete("delete/{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteSeries(Guid id)
        {
            return Ok(await _userSeriesService.DeleteSeries(id));
        }
    }
}
