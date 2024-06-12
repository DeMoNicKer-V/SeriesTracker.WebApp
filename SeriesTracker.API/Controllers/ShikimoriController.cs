﻿using GraphQL;
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

        [HttpGet("page/{page}")]
        public async Task<ActionResult> GetAnimes(int page)
        {
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetAnimes(page);
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

        [HttpPost("animes")]
        public async Task<ActionResult> GetAnimesByAllParams([FromBody] ShikimoriParamsRequest request)
        {
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetAnimesByAllParams(request.Page, request.Name, request.Season, request.Status, request.Kind, request.Genre);
            return Ok(graphQLResponse.Data.Animes);
        }
    }
}
