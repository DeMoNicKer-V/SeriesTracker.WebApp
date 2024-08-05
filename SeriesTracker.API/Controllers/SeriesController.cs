using GraphQL;
using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;
using System.Text.RegularExpressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("controller")]
    public class SeriesController : ControllerBase
    {
        private readonly ISeriesService _seriesService;
        private readonly ICategoryService _categoryService;

        public SeriesController(ISeriesService seriesService, ICategoryService categoryService)
        {
            _seriesService = seriesService;
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<int>> GetAllSeriesCount()
        {
            var seriesCount = await _seriesService.GetAllSeriesCount();
            return Ok(seriesCount);
        }

        [HttpGet("id/{id}")]
        public async Task<ActionResult<int>> GetSeriesById(Guid id)
        {
            var s = await _seriesService.GetSeriesById(id);

            var response = new SeriesResponse(s.Id, s.AnimeId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.CategoryId, s.IsFavorite);

            return Ok(response);
        }
        private readonly ShikimoriService ShikimoriService = new();

        [HttpGet("{page:int}/{query}")]
        public async Task<ActionResult<List<SeriesResponse>>> GetSeriesList(int page = 1) 
        {
            var seriesList = await _seriesService.GetSeriesList();
            var response = seriesList.Select(s => new SeriesResponse(s.Id, s.AnimeId, s.WatchedEpisode, s.AddedDate, s.ChangedDate, s.CategoryId, s.IsFavorite)).Skip(30 * (page - 1)).Take(30);
            var count = await _seriesService.GetAllSeriesCount();
            string idsRequest = string.Join(",", seriesList.Select(s => s.AnimeId));
            var graphQLResponse = await ShikimoriService.GetAnimeById(idsRequest);
            var response2 = graphQLResponse.Data.Animes.Select(s => new ShikimoriResponse(s.Id, s.Description, s.Episodes, s.StartDate, s.Score, s.Title, s.SubTitle, s.PictureUrl, s.Rating, s.Kind, s.Status));
            int index = 0;
            List<SeriesAnimeResponse> animeResponses = [];
            foreach (var item in response2)
            {
                animeResponses.Add(new SeriesAnimeResponse(response.ElementAt(index).Id, response.ElementAt(index).AnimeId, response.ElementAt(index).WatchedEpisode, response.ElementAt(index).AddedDate, response.ElementAt(index).ChangedDate, response.ElementAt(index).CategoryId, response.ElementAt(index).IsFavorite, item.Description, item.Episodes, item.StartDate, item.Score, item.Title, item.SubTitle, item.PictureUrl, item.Rating, item.Kind, item.Status));
            index++;
            }


            return Ok(animeResponses);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateSeries([FromBody] SeriesRequest request) 
        {
            bool isAnime = await _seriesService.GetSeriesByAnimeId(request.AnimeId);
            if (isAnime)
            {
                return BadRequest("Данный сериал уже есть в вашем списке.");
            }
            var date = DateTime.Now.ToString("s");
            var (series, error) = Series.Create(Guid.NewGuid(), request.AnimeId, request.WatchedEpisode, date, date, request.CategoryId, request.IsFavorite);

            if (!string.IsNullOrEmpty(error)) 
            {
                return BadRequest(error);
            }

            var seriesId = await _seriesService.CreateSeries(series);
            return Ok(seriesId);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Guid>> UpdateSeries(Guid id, [FromBody] SeriesRequest request)
        {
            var date = DateTime.Now.ToString("s");
            var seriesId = await _seriesService.UpdateSeries(id, request.WatchedEpisode,
               date, request.CategoryId, request.IsFavorite);
            return Ok(seriesId);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteSeries(Guid id)
        {
            return Ok(await _seriesService.DeleteSeries(id));
        }
    }
}
