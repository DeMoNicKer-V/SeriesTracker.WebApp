using GraphQL;
using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("shikimori")]
    public class ShikimoriController : ControllerBase
    {
        private readonly ShikimoriService ShikimoriService = new();

        private readonly ISeriesService _seriesService;

        public ShikimoriController(ISeriesService seriesService)
        {
            _seriesService = seriesService;
        }

        [HttpGet]
        public async Task<ActionResult> GetGenres()
        {
            GraphQLResponse<GenreList> graphQLResponse = await ShikimoriService.GetGenres();
            return Ok(graphQLResponse.Data.Genres);
        }

        [HttpGet("page/{page}/order/{order}")]
        public async Task<ActionResult> GetAnimes(int page, string order)
        {
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetAnimes(page, order);
            return Ok(graphQLResponse.Data.Animes);
        }

        [HttpGet("id/{id}")]
        public async Task<ActionResult> GetAnimeById(int id)
        {
            bool isSeries = await _seriesService.GetSeriesByAnimeId(id);
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetAnimeById(id.ToString());
            var response = new ShikimoriResponseIdInfo(graphQLResponse.Data.Animes[0], isSeries);
            return Ok(response);
        }

        [HttpGet("random")]
        public async Task<ActionResult> GetRandomAnime()
        {
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetRandomAnime();
            return Ok(graphQLResponse.Data.Animes[0].Id);
        }

        [HttpPost("animes")]
        public async Task<ActionResult> GetAnimesByAllParams([FromBody] ShikimoriParamsRequest request)
        {
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetAnimesByAllParams(request.Page, request.Name, request.Season, request.Status, request.Kind, request.Genre, request.Order);
            return Ok(graphQLResponse.Data.Animes);
        }
    }
}
