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
        private readonly ICategoryService _categoryService;
        private readonly ISeriesService _seriesService;
        private readonly IUserSeriesService _userSeriesService;
        private readonly ShikimoriService ShikimoriService = new();
        public ShikimoriController(ISeriesService seriesService, ICategoryService categoryService, IUserSeriesService userSeriesService)
        {
            _seriesService = seriesService;
            _categoryService = categoryService;
            _userSeriesService = userSeriesService;
        }


        [HttpGet("user/{usermame}/list")]
        public async Task<ActionResult<ShikimoriAnimeBaseList[]>> GetAnimesByUser(string usermame, [FromQuery] ShikimoriParamsRequest request, int mylist = 0)
        {
            string? userSeries = await _userSeriesService.GetSeriesAnimeIdsList(usermame, mylist);
            if (string.IsNullOrEmpty(userSeries))
            {
                return Ok(new List<ShikimoriAnimeBaseList>());
            }
            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse = await ShikimoriService.GetAnimesByAllParamsAndIds(request.Page, request.Name, userSeries, request.Season, request.Status,
                                                           request.Kind, request.Genre, request.Order, request.Censored);
            return new ObjectResult(graphQLResponse.Data.Animes);
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

        [HttpGet("activity")]
        public async Task<ActionResult> GetLastAnimesById(string id)
        {
            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse = await ShikimoriService.GetAnimeListByIds(id);
            var anime = graphQLResponse.Data.Animes;
            var response = new List<LastActivityResponse>();
            foreach (var item in anime)
            {
                var ob = await _userSeriesService.GetSeriesByAnimeIdAsync(item.Id);
                var b = new LastActivityResponse(item.Id, item.PictureUrl, item.Title, ob.ChangedDate);
                response.Add(b);
            }
            var sortedResponse = response.OrderByDescending(item => DateTime.Parse(item.Date));
            return new OkObjectResult(sortedResponse);
        }

        [HttpGet]
        public async Task<ActionResult> GetAnimesByAllParams([FromQuery] ShikimoriParamsRequest request)
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
                                                     item.Description, item.Episodes, item.Duration, item.StartDate, item.Score, item.Title, item.SubTitle,
                                                     item.PictureUrl, item.Rating, item.Kind, item.Status);
                    }

                    return new AnimeSeriesResponse(item.Id, 0, string.Empty, string.Empty, false,
                                                 item.Description, item.Episodes, item.Duration, item.StartDate, item.Score, item.Title, item.SubTitle,
                                                 item.PictureUrl, item.Rating, item.Kind, item.Status);
                })
                .ToList();

            return Ok(animeResponses);
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

        [HttpGet("genres")]
        public async Task<ActionResult> GetGenres()
        {
            GraphQLResponse<GenreList> graphQLResponse = await ShikimoriService.GetGenres();
            return Ok(graphQLResponse.Data.Genres);
        }

        [HttpGet("groupGenres")]
        public async Task<ActionResult> GetGroupGenres()
        {
            GraphQLResponse<GenreList> graphQLResponse = await ShikimoriService.GetGenres();

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
            GraphQLResponse<ShikimoriAnimeList> graphQLResponse = await ShikimoriService.GetRandomAnime();
            return Ok(graphQLResponse.Data.Animes[0].Id);
        }
    }
}