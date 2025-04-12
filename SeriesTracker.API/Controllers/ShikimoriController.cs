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
        private readonly IShikimoriService _shikimoriService;
        private readonly ICalendarFetcher _fetcher;

        public ShikimoriController(
         IShikimoriService shikimoriService,
         ICalendarFetcher fetcher)
        {
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
        public async Task<IResult> GetAnimeById(string id)
        {
            var userId = GetUserIdFromClaims();
            var animeResponse = await _shikimoriService.GetAnimeById(userId, id);

            return Results.Ok(animeResponse);
        }

        [HttpGet("activity")]
        public async Task<IResult> GetLastAnimesById(string userName, string id)
        {
            var animeResponse = await _shikimoriService.GetRecentAnimesByIds(userName, id);

            return Results.Ok(animeResponse);
        }

        [HttpGet]
        public async Task<IResult> GetAnimesByAllParams([FromQuery] ShikimoriParamsRequest request)
        {
            var userId = GetUserIdFromClaims();
            var animeResponse = await _shikimoriService.GetAnimesByAllParams(userId, request.Page, request.Name, request.Season, request.Status,
                                                           request.Kind, request.Genre, request.Order, request.Censored);
            return Results.Ok(animeResponse);
        }

        [HttpGet("{name}")]
        public async Task<IResult> GetAnimesByName(string name)
        {
            var userId = GetUserIdFromClaims();
            var animeResponse = await _shikimoriService.GetAnimesByName(userId, name);

            return Results.Ok(animeResponse);
        }

        [HttpGet("genres")]
        public async Task<ActionResult> GetGenres()
        {
            var genres = await _shikimoriService.GetGenres();
            return Ok(genres);
        }

        [HttpGet("groupGenres")]
        public async Task<ActionResult> GetGroupGenres()
        {
            var groupingGenres = await _shikimoriService.GetGroupingGenres();

            return Ok(groupingGenres);
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