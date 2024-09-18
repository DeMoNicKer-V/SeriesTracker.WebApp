using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using System.Security.Claims;


namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("controller")]
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
        private readonly ShikimoriService ShikimoriService = new();

        [HttpGet("{page:int}/{query}")]
        public async Task<ActionResult<List<SeriesResponse>>> GetSeriesList(int page = 1) 
        {
            var seriesList = await _seriesService.GetSeriesList();
            var response = seriesList.Select(s => new SeriesResponse(s.Id, s.AnimeId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.CategoryId, s.IsFavorite)).Skip(30 * (page - 1)).Take(30);
            var count = await _seriesService.GetAllSeriesCount();
            string idsRequest = string.Join(",", seriesList.Select(s => s.AnimeId));
            var graphQLResponse = await ShikimoriService.GetAnimeById(idsRequest);
            var response2 = graphQLResponse.Data.Animes.Select(s => new ShikimoriResponse(s.Id, s.Description, s.Episodes, s.StartDate, s.Score, s.Title, s.SubTitle, s.PictureUrl, s.Rating, s.Kind, s.Status));
            int index = 0;
            List<SeriesAnimeResponse> animeResponses = [];
            foreach (var item in response2)
            {
                animeResponses.Add(new SeriesAnimeResponse(response.ElementAt(index).Id, response.ElementAt(index).AnimeId, response.ElementAt(index).WatchedEpisode, response.ElementAt(index).AddedDate, response.ElementAt(index).ChangedDate, response.ElementAt(index).CategoryId, response.ElementAt(index).IsFavorite, item.Description, item.Episodes, item.StartDate, item.Score, item.Title, item.SubTitle, item.PictureUrl, item.Rating, item.Kind, item.Status));
            index++;
            }


            return Ok(animeResponses);
        }

        [Authorize]
        [HttpPost]
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
            var (series, error) = UserSeries.Create(Guid.NewGuid(), request.AnimeId,  Guid.Parse(userId), request.CategoryId, request.WatchedEpisode, date, date, request.IsFavorite);

            if (!string.IsNullOrEmpty(error)) 
            {
                return BadRequest(error);
            }

            var seriesId = await _userSeriesService.CreateAsync(series);
            return Ok(seriesId);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Guid>> UpdateSeries(Guid id, [FromBody] SeriesRequest request)
        {
            var date = DateTime.Now.ToString("s");
            var seriesId = await _seriesService.UpdateSeries(id, request.WatchedEpisode,
               date, request.CategoryId, request.IsFavorite);
            return Ok(seriesId);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteSeries(Guid id)
        {
            return Ok(await _seriesService.DeleteSeries(id));
        }

        [HttpDelete("animeId/{animeId:int}")]
        public async Task<ActionResult<Guid>> DeleteSeriesByAnimeId(int animeId)
        {
            Guid seriesId = await _seriesService.GetSeriesByAnimeId(animeId);
            return Ok(await _seriesService.DeleteSeries(seriesId));
        }
    }
}
