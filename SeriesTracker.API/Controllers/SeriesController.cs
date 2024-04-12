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
        public async Task<ActionResult<List<SeriesResponse>>> GetSeriesList() 
        {
            var seriesList = await _seriesService.GetSeriesList();

            var response = seriesList.Select(s => new SeriesResponse(s.Id, s.Title, s.Description, s.WatchedEpisode, s.LastEpisode, s.Duration, s.Rating,
                s.ReleaseDate, s.AddedDate, s.AddedDate, s.OverDate, s.IsFavorite, s.IsFavorite));

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateSeries([FromBody] SeriesRequest request) 
        {
            var (series, error) = Series.Create(Guid.NewGuid(), request.Title, request.Description, request.WatchedEpisode, request.LastEpisode,
                request.Duration, request.Rating, request.ReleaseDate, request.AddedDate, request.ChangedDate, request.OverDate, request.IsOver, request.IsFavorite);

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
            var seriesId = await _seriesService.UpdateSeries(id, request.Title, request.Description, request.WatchedEpisode, request.LastEpisode,
                request.Duration, request.Rating, request.ReleaseDate, request.AddedDate, request.ChangedDate, request.OverDate, request.IsOver, request.IsFavorite);
            return Ok(seriesId);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteSeries(Guid id)
        {
            return Ok(await _seriesService.DeleteSeries(id));
        }
    }
}
