﻿using GraphQL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;
using System.Linq;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("shikimori")]
    public class ShikimoriController : ControllerBase
    {
        private readonly ShikimoriService ShikimoriService = new();

        private readonly ISeriesService _seriesService;
        private readonly IUserSeriesService _userSeriesService;
        private readonly ICategoryService _categoryService;

        public ShikimoriController(ISeriesService seriesService, ICategoryService categoryService, IUserSeriesService userSeriesService)
        {
            _seriesService = seriesService;
            _categoryService = categoryService;
            _userSeriesService = userSeriesService;
        }

        [HttpGet]
        public async Task<ActionResult> GetGenres()
        {
            GraphQLResponse<GenreList> graphQLResponse = await ShikimoriService.GetGenres();
            return Ok(graphQLResponse.Data.Genres);
        }

        [HttpGet("id/{id}")]
        public async Task<ActionResult> GetAnimeById(int id)
        {
            UserSeries? userSeries = await _userSeriesService.GetSeriesByAnimeIdAsync(id);
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetAnimeById(id.ToString());
            var anime = graphQLResponse.Data.Animes[0];
            var response = new { Series = userSeries, Anime = anime };
            return new OkObjectResult(response);
        }

        [HttpGet("random")]
        public async Task<ActionResult> GetRandomAnime()
        {
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetRandomAnime();
            return Ok(graphQLResponse.Data.Animes[0].Id);
        }

        [HttpGet("{query}")]
        public async Task<ActionResult<List<AnimeSeriesResponseSearch>>> GetAnimesByName(string query)
        {
            var seriesList = await _seriesService.GetSeriesList();
            var categoryList = await _categoryService.GetCategoryList();
            var idsRequest = seriesList.Select(s => s.AnimeId);
            var graphQLResponse = await ShikimoriService.GetAnimesByName(query);
            var response2 = graphQLResponse.Data.Animes.Select(s => new ShikimoriResponse(s.Id, s.Description, s.Episodes, s.StartDate, s.Score, s.Title, s.SubTitle, s.PictureUrl, s.Rating, s.Kind, s.Status));
            List<AnimeSeriesResponseSearch> animeResponses = [];
            foreach (var item in graphQLResponse.Data.Animes)
            {
                if (idsRequest.Contains(item.Id))
                {
                    var that = seriesList.FirstOrDefault(s => s.AnimeId == item.Id);
                    string category = string.Empty;
                    if (that.CategoryId != 0)
                    {
                        category = categoryList.FirstOrDefault(s => s.Id == that.CategoryId).Name;
                    }
                    animeResponses.Add(new AnimeSeriesResponseSearch(item.Id, that.CategoryId, category, that.IsFavorite, item.Description, item.Episodes, item.EpisodesAired, item.StartDate, item.Score, item.Title, item.SubTitle, item.PictureUrl, item.Rating, item.Kind, item.Status));

                }
                else
                {
                    animeResponses.Add(new AnimeSeriesResponseSearch(item.Id, 0, string.Empty, false, item.Description, item.Episodes, item.EpisodesAired, item.StartDate, item.Score, item.Title, item.SubTitle, item.PictureUrl, item.Rating, item.Kind, item.Status));
                }
            }


            return Ok(animeResponses);
        }

        [HttpPost("animes")]
        public async Task<ActionResult> GetAnimesByAllParams([FromBody] ShikimoriParamsRequest request)
        {
            var userId = HttpContext.User.FindFirst("userId")?.Value;

            var seriesDictionary = (await _userSeriesService.GetSeriesList(userId))
                .ToDictionary(s => s.AnimeId, s => s);
            var categoryDictionary = (await _categoryService.GetCategoryList())
                .ToDictionary(c => c.Id, c => c);


            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse =
                await ShikimoriService.GetAnimesByAllParams(request.Page, request.Name, request.Season, request.Status,
                                                           request.Kind, request.Genre, request.Order, request.Censored);

            var animeResponses = graphQLResponse.Data.Animes
                .Select(item =>
                {
                    if (seriesDictionary.ContainsKey(item.Id))
                    {
                        var series = seriesDictionary[item.Id];
                     
                            var category = categoryDictionary[series.CategoryId];
                            return new AnimeSeriesResponse(item.Id, series.CategoryId, category.Name, category.Color, series.IsFavorite,
                                                         item.Description, item.Episodes, item.StartDate, item.Score, item.Title, item.SubTitle,
                                                         item.PictureUrl, item.Rating, item.Kind, item.Status);
                        
                    }

                    return new AnimeSeriesResponse(item.Id, 0, string.Empty, string.Empty, false,
                                                 item.Description, item.Episodes, item.StartDate, item.Score, item.Title, item.SubTitle,
                                                 item.PictureUrl, item.Rating, item.Kind, item.Status);
                })
                .ToList();

            return Ok(animeResponses);
        }
    }
}
