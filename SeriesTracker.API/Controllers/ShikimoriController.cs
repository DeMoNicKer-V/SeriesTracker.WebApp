using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Models;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("shikimori")]
    public class ShikimoriController : ControllerBase
    {
        private readonly ICategorySeriesService _categorySeriesService;
        private readonly IShikimoriService _shikimoriService;
        private readonly ICalendarFetcher _fetcher;
        public ShikimoriController(ICategorySeriesService categorySeriesService,
         IShikimoriService shikimoriService,
         ICalendarFetcher fetcher)
        {
            _categorySeriesService = categorySeriesService;
            _shikimoriService = shikimoriService;
            _fetcher = fetcher; 
        }

        [HttpGet("calendar")]
        public async Task<IActionResult> GetOngoings()
        {
                var data = await _fetcher.FetchData();
                return new OkObjectResult(data);
        }

        [HttpGet("id/{id}")]
        public async Task<ActionResult> GetAnimeById(int id)
        {
            var userName = HttpContext.User.FindFirst("userName")?.Value != null ? HttpContext.User.FindFirst("userName")?.Value : "";
            var graphQLResponse = await _shikimoriService.GetAnimeById(id.ToString());
            var anime = graphQLResponse.Animes[0];
            var response = await _categorySeriesService.GetSeriesAnimeId(userName, anime.Id);
            return (new OkObjectResult(_shikimoriService.MapToAnimeSeriesFullDto(anime, response, true)));
        }

        [HttpGet("activity")]
        public async Task<ActionResult> GetLastAnimesById(string userName, string id)
        {

            var graphQLResponse = await _shikimoriService.GetAnimeListByIds(id);
            var animeTasks = graphQLResponse.Animes
                .Select(async item =>
                {
                    var response = await _categorySeriesService.GetSeriesAnimeId(userName, item.Id);
                    return _shikimoriService.MapToAnimeSeriesFullDto(item, response, false);
                });

            AnimeSeriesFullDto[] response = (await Task.WhenAll(animeTasks))
                .Select(obj => (AnimeSeriesFullDto)obj).OrderByDescending(s => s.ChangedDate)
                .ToArray();
            return Ok(response);
        }

        [HttpGet]
        public async Task<ActionResult> GetAnimesByAllParams([FromQuery] ShikimoriParamsRequest request)
        {
            var userName = HttpContext.User.FindFirst("userName")?.Value != null ? HttpContext.User.FindFirst("userName")?.Value : "";
            var graphQLResponse = await _shikimoriService.GetAnimesByAllParams(request.Page, request.Name, request.Season, request.Status,
                                                           request.Kind, request.Genre, request.Order, request.Censored);

            var animeTasks = graphQLResponse.Animes
                .Select(async item =>
                {
                    var response = await _categorySeriesService.GetSeriesAnimeId(userName, item.Id);
                    return _shikimoriService.MapToAnimeSeriesFullDto(item, response, false);
                });
            var animeResponses = await Task.WhenAll(animeTasks);
            return Ok(animeResponses);


        }

        [HttpGet("{name}")]
        public async Task<ActionResult> GetAnimesByName(string name)
        {
            var userName = HttpContext.User.FindFirst("userName")?.Value != null ? HttpContext.User.FindFirst("userName")?.Value : "";

            var graphQLResponse = await _shikimoriService.GetAnimesByName(name);
            var animeTasks = graphQLResponse.Animes
                .Select(async item =>
                {
                    var response = await _categorySeriesService.GetSeriesAnimeId(userName, item.Id);
                    return _shikimoriService.MapToAnimeSeriesFullDto(item, response, false);
                });
            var animeResponses = await Task.WhenAll(animeTasks);
            return Ok(animeResponses);
        }

        [HttpGet("genres")]
        public async Task<ActionResult> GetGenres()
        {
            var graphQLResponse = await _shikimoriService.GetGenres();
            return Ok(graphQLResponse.Genres);
        }

        [HttpGet("groupGenres")]
        public async Task<ActionResult> GetGroupGenres()
        {
            var graphQLResponse  = await _shikimoriService.GetGenres();

            var groupedRecords = graphQLResponse.Genres
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
            var graphQLResponse = await _shikimoriService.GetRandomAnime();
            return Ok(graphQLResponse.Animes[0].Id);
        }
    }
}