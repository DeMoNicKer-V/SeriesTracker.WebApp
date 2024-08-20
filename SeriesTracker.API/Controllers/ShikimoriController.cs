using GraphQL;
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
        private readonly ICategoryService _categoryService;

        public ShikimoriController(ISeriesService seriesService, ICategoryService categoryService)
        {
            _seriesService = seriesService;
            _categoryService = categoryService;
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
            Guid isSeries = await _seriesService.GetSeriesByAnimeId(id);

 
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetAnimeById(id.ToString());
            var response = graphQLResponse.Data.Animes[0];
            if (isSeries != Guid.Empty)
            {
                var series = await _seriesService.GetSeriesById(isSeries);
                return Ok(new { Series = series, Anime = response });
            }
            return Ok(new { Series = new { }, Anime = response });
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
                        category = categoryList.FirstOrDefault(s => s.Id == that.CategoryId).Title;
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
         
            var seriesList = await _seriesService.GetSeriesList();
            var categoryList = await _categoryService.GetCategoryList();
            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse = await ShikimoriService.GetAnimesByAllParams(request.Page, request.Name, request.Season, request.Status, request.Kind, request.Genre, request.Order, request.Censored);
            var idsRequest = seriesList.Select(s => s.AnimeId);
            List<AnimeSeriesResponse> animeResponses = [];
            foreach (var item in graphQLResponse.Data.Animes)
            {
                if (idsRequest.Contains(item.Id))
                {
                    var that = seriesList.FirstOrDefault(s => s.AnimeId == item.Id);
             
                    if (that.CategoryId != 0)
                    {
                        
                       var category = categoryList.FirstOrDefault(s => s.Id == that.CategoryId); ;
                        animeResponses.Add(new AnimeSeriesResponse(item.Id, that.CategoryId, category.Title, category.Color, that.IsFavorite, item.Description, item.Episodes, item.StartDate, item.Score, item.Title, item.SubTitle, item.PictureUrl, item.Rating, item.Kind, item.Status));
                    }

                }
                else
                {
                    animeResponses.Add(new AnimeSeriesResponse(item.Id, 0, string.Empty, string.Empty, false, item.Description, item.Episodes, item.StartDate, item.Score, item.Title, item.SubTitle, item.PictureUrl, item.Rating, item.Kind, item.Status));
                }
            }


            return Ok(animeResponses);
        }
    }
}
