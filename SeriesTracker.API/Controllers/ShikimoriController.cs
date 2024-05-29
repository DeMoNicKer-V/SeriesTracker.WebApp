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

        [HttpGet]
        public async Task<ActionResult> GetAnimes()
        {
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetAnimes(1);
            return Ok(graphQLResponse.Data.Animes);
        }
    }
}
