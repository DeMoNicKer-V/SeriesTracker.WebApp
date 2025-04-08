using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("shikimori")]
    public class ShikimoriController : ControllerBase
    {
        private readonly ICategorySeriesService _categorySeriesService;
        private readonly IUserService _userService;
        private readonly IShikimoriService _shikimoriService;
        private readonly ICalendarFetcher _fetcher;

        public ShikimoriController(ICategorySeriesService categorySeriesService,
         IShikimoriService shikimoriService,
         ICalendarFetcher fetcher,
         IUserService userService)
        {
            _categorySeriesService = categorySeriesService;
            _shikimoriService = shikimoriService;
            _fetcher = fetcher;
            _userService = userService;
        }

        [HttpGet("calendar")]
        public async Task<IActionResult> GetOngoings()
        {
            var data = await _fetcher.FetchData();
            return new OkObjectResult(data);
        }

        [HttpGet("activity")]

        [HttpGet]
        public async Task<ActionResult> GetAnimesByAllParams([FromQuery] ShikimoriParamsRequest request)
        {
            var userId = GetUserIdFromClaims();
            var animeShorts = await _shikimoriService.GetAnimesByAllParams(userId, request.Page, request.Name, request.Season, request.Status,
                                                           request.Kind, request.Genre, request.Order, request.Censored);
            return Ok(animeShorts);
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
            var graphQLResponse = await _shikimoriService.GetGenres();

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

        private Guid GetUserIdFromClaims()
        {
            var userClaims = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;

            if (Guid.TryParse(userClaims, out var userId))
            {
                return userId;
            }
            else return Guid.Empty;
        }
    }
}