using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("controller")]
    public class SeriesController : ControllerBase
    {
        private readonly ISeriesService _seriesService;

        public SeriesController(ISeriesService seriesService)
        {
            _seriesService = seriesService;
        }

        [HttpGet]
        public async Task<ActionResult<int>> GetAllSeriesCount()
        {
            var seriesCount = await _seriesService.GetAllSeriesCount();

            return Ok(seriesCount);
        }


        [HttpGet("{page:int}")]
        public async Task<ActionResult<List<SeriesResponse>>> GetSeriesList(int page = 1) 
        {
            //(?i)^([A])(?-i)")
            var seriesList = await _seriesService.GetSeriesList();

            var response = seriesList.Select(s => new SeriesResponse(s.Id, s.Title, s.Description, s.WatchedEpisode, s.LastEpisode, s.Duration, s.Rating, s.ImagePath,
                s.ReleaseDate, s.AddedDate, s.AddedDate, s.OverDate, s.IsFavorite, s.IsFavorite)).Skip(30 * (page - 1)).Take(30);

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateSeries([FromBody] SeriesRequest request) 
        {
            var date = DateTime.Now.ToString();
            var (series, error) = Series.Create(Guid.NewGuid(), request.Title, request.Description, request.WatchedEpisode, request.LastEpisode,
                request.Duration, request.Rating, request.ImagePath, request.ReleaseDate, date, date, request.OverDate, request.IsOver, request.IsFavorite);

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
            var date = DateTime.Now.ToString();
            var seriesId = await _seriesService.UpdateSeries(id, request.Title, request.Description, request.WatchedEpisode, request.LastEpisode,
                request.Duration, request.Rating, request.ReleaseDate, date, request.OverDate, request.IsOver, request.IsFavorite);
            return Ok(seriesId);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteSeries(Guid id)
        {
            return Ok(await _seriesService.DeleteSeries(id));
        }
    }
}
