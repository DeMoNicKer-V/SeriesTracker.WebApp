using GraphQL;
using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;
using System.Threading.Tasks;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("shikimori")]
    public class ShikimoriController : ControllerBase
    {
        private readonly ICategorySeriesService _categorySeriesService;
        private readonly IMyFetcher _myFetcher;
        private readonly IShikimoriService _shikimoriService;


        public ShikimoriController(ICategorySeriesService categorySeriesService, 
         IShikimoriService shikimoriService,
         IMyFetcher myFetcher)
        {
            _categorySeriesService = categorySeriesService;
            _shikimoriService = shikimoriService;
            _myFetcher = myFetcher;
        }

        [HttpGet("getData")] //  Укажите маршрут для этого метода (например, /api/My/getData)
        public async Task<IActionResult> GetData()
        {
           
            {
                //  Определяем тип ожидаемого ответа
                //  Предположим, что API, к которому мы обращаемся, возвращает такой JSON
                //  { "message": "Hello from external API", "value": 42 }
                //  Тогда определим класс:
                //  public class ExternalApiResponse { public string? Message { get; set; } public int Value { get; set; } }
                //  И передадим его как тип параметра
                var data = await _myFetcher.FetchAsync<ExternalApiResponse>("https://shikimori.one/api/calendar/"); //  Вызываем FetchAsync
                return Ok(data); // Возвращаем данные (HTTP 200 OK) в формате JSON
           
        }
    }

    //  Вспомогательный класс для представления данных ответа
    public class ExternalApiResponse
    {
        public string? Message { get; set; }
        public int Value { get; set; }
    }

    [HttpGet("id/{id}")]
        public async Task<ActionResult> GetAnimeById(int id)
        {
            var userName = HttpContext.User.FindFirst("userName")?.Value != null ? HttpContext.User.FindFirst("userName")?.Value : "";
            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse = await _shikimoriService.GetAnimeById(id.ToString());
            var anime = graphQLResponse.Data.Animes[0];
            var response = await _categorySeriesService.GetSeriesAnimeId(userName, anime.Id);
            return (new OkObjectResult(_shikimoriService.MapToAnimeSeriesFullDto(anime, response, true)));
        }

        [HttpGet("activity")]
        public async Task<ActionResult> GetLastAnimesById(string userName, string id)
        {

            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse = await _shikimoriService.GetAnimeListByIds(id);
            var animeTasks = graphQLResponse.Data.Animes
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
            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse =
                await _shikimoriService.GetAnimesByAllParams(request.Page, request.Name, request.Season, request.Status,
                                                           request.Kind, request.Genre, request.Order, request.Censored);

            var animeTasks = graphQLResponse.Data.Animes
                .Select(async item =>
                {
                    var response = await _categorySeriesService.GetSeriesAnimeId(userName, item.Id);
                    return _shikimoriService.MapToAnimeSeriesFullDto(item, response, false);
                });
            var animeResponses = await Task.WhenAll(animeTasks);
            return Ok(animeResponses);


        }

        [HttpGet("{query}")]
        public async Task<ActionResult> GetAnimesByName(string query)
        {
            var userName = HttpContext.User.FindFirst("userName")?.Value != null ? HttpContext.User.FindFirst("userName")?.Value : "";

            var graphQLResponse = await _shikimoriService.GetAnimesByName(query);
            var animeTasks = graphQLResponse.Data.Animes
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
            GraphQLResponse<GenreList> graphQLResponse = await _shikimoriService.GetGenres();
            return Ok(graphQLResponse.Data.Genres);
        }

        [HttpGet("groupGenres")]
        public async Task<ActionResult> GetGroupGenres()
        {
            GraphQLResponse<GenreList> graphQLResponse = await _shikimoriService.GetGenres();

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
            GraphQLResponse<ShikimoriAnimeBaseList> graphQLResponse = await _shikimoriService.GetRandomAnime();
            return Ok(graphQLResponse.Data.Animes[0].Id);
        }
    }
}