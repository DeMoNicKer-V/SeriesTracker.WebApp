using AutoMapper;
using GraphQL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;
using System.Linq;
using System.Text.Json;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("shikimori")]
    public class ShikimoriController : ControllerBase
    {

        private readonly ICategorySeriesService _categorySeriesService;
        private readonly IUserSeriesService _userSeriesService;
        private readonly IShikimoriService _shikimoriService;
        public ShikimoriController(ICategorySeriesService categorySeriesService,
            IUserSeriesService userSeriesService, IShikimoriService shikimoriService)
        {
            _categorySeriesService = categorySeriesService;
            _userSeriesService = userSeriesService;
            _shikimoriService = shikimoriService;
        }


        [HttpGet("user/{usermame}/list")]
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

        [HttpGet("id/{id}")]
        public async Task<ActionResult> GetAnimeById(int id)
        {
            var userId = Guid.Parse(HttpContext.User.FindFirst("userId")?.Value);
            UserSeries? userSeries = await _userSeriesService.GetSeriesByAnimeIdAsync(id, userId);
            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse = await _shikimoriService.GetAnimeById(id.ToString());
            var anime = graphQLResponse.Data.Animes.Select(item => _shikimoriService.MapToFullDto(item)).First();
            var response = new { Series = userSeries, Anime = anime };
            return new OkObjectResult(response);
        }

        [HttpGet("activity")]
        public async Task<ActionResult> GetLastAnimesById(string id)
        {
            var userId = Guid.Parse(HttpContext.User.FindFirst("userId")?.Value);
            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse = await _shikimoriService.GetAnimeListByIds(id);
            var anime = graphQLResponse.Data.Animes;
            var response = new List<LastActivityResponse>();
            foreach (var item in anime)
            {
                var ob = await _userSeriesService.GetSeriesByAnimeIdAsync(item.Id, userId);
                var b = new LastActivityResponse(item.Id, item.PictureUrl, item.Title, ob.ChangedDate);
                response.Add(b);
            }
            var sortedResponse = response.OrderByDescending(item => DateTime.Parse(item.Date));
            return new OkObjectResult(sortedResponse);
        }

        [HttpGet]
        public async Task<ActionResult> GetAnimesByAllParams([FromQuery] ShikimoriParamsRequest request)
        {
            var userId = Guid.Parse(HttpContext.User.FindFirst("userId")?.Value);
            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse =
                await _shikimoriService.GetAnimesByAllParams(request.Page, request.Name, request.Season, request.Status,
                                                           request.Kind, request.Genre, request.Order, request.Censored);

            var animeTasks = graphQLResponse.Data.Animes
                .Select(async item =>
                {
                    var response = await _userSeriesService.GetCategoryByAnimeSeries(item.Id, userId);
                    if (response != null)
                    {
                        return _shikimoriService.MapToAnimeSeriesDto(item, response.Id, response.Name, response.Color);
                    }
                    return _shikimoriService.MapToAnimeSeriesDto(item);

                });
          var animeResponses = await Task.WhenAll(animeTasks);
            return Ok(animeResponses.ToList());

        }

        [HttpGet("{query}")]
        public async Task<ActionResult<ShikimoriAnimeBaseList>> GetAnimesByName(string query)
        {

            var graphQLResponse = await _shikimoriService.GetAnimesByName(query);

            

            return Ok(graphQLResponse.Data.Animes);
        }

        [HttpGet("genres")]
        public async Task<ActionResult> GetGenres()
        {
            GraphQLResponse<GenreList> graphQLResponse = await _shikimoriService.GetGenres();
            return Ok(graphQLResponse.Data.Genres);
        }

        [HttpGet("groupGenres")]
        public async Task<ActionResult> GetGroupGenres()
        {
            GraphQLResponse<GenreList> graphQLResponse = await _shikimoriService.GetGenres();

            var groupedRecords = graphQLResponse.Data.Genres
        .GroupBy(r => r.Kind)
        .ToDictionary(g => g.Key, g => g.ToList());

            // Создание объекта для хранения результатов
            var result = new
            {
                theme = groupedRecords.ContainsKey("theme") ? groupedRecords["theme"] : new List<Genre>(),
                genre = groupedRecords.ContainsKey("genre") ? groupedRecords["genre"] : new List<Genre>(),
                demographic = groupedRecords.ContainsKey("demographic") ? groupedRecords["demographic"] : new List<Genre>()
            };
         
            return Ok(result);
        }

        [HttpGet("random")]
        public async Task<ActionResult> GetRandomAnime()
        {
            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse = await _shikimoriService.GetRandomAnime();
            return Ok(graphQLResponse.Data.Animes[0].Id);
        }
    }
}