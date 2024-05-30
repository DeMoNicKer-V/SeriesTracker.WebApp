using GraphQL;
using Microsoft.AspNetCore.Mvc;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("shikimori")]
    public class ShikimoriController : ControllerBase
    {
        private readonly ShikimoriService ShikimoriService = new();

        [HttpGet("{page}")]
        public async Task<ActionResult> GetAnimes(int page)
        {
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetAnimes(page);
            return Ok(graphQLResponse.Data.Animes);
        }

        [HttpGet("id/{id}")]
        public async Task<ActionResult> GetAnimeById(int id)
        {
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetAnimesById(id.ToString());
            return Ok(graphQLResponse.Data.Animes);
        }
    }
}
