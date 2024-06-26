﻿using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using System.Text.RegularExpressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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

        [HttpGet("id/{id}")]
        public async Task<ActionResult<int>> GetSeriesById(Guid id)
        {
            var s = await _seriesService.GetSeriesById(id);

            var response = new SeriesResponse(s.Id, s.Title, s.Description, s.WatchedEpisode, s.LastEpisode, s.Duration, s.Rating, s.ImagePath,
               s.ReleaseDate, s.AddedDate, s.ChangedDate, s.OverDate, s.IsOver, s.IsFavorite);

            return Ok(response);
        }

        [HttpGet("{query}")]
        public async Task<ActionResult<List<SeriesResponse>>> GetSeriesListSearch(string query)
        {
            var seriesList = await _seriesService.GetSearchList(query.ToLowerInvariant());

            var response = seriesList.Select(s => new SeriesResponse(s.Id, s.Title, s.Description, s.WatchedEpisode, s.LastEpisode, s.Duration, s.Rating, s.ImagePath,
                s.ReleaseDate, s.AddedDate, s.ChangedDate, s.OverDate, s.IsOver, s.IsFavorite)).Take(5);

            return Ok(response);
        }


        [HttpGet("{page:int}/{query}")]
        public async Task<ActionResult<List<SeriesResponse>>> GetSeriesList(int page = 1, string? query = null) 
        {
            var seriesList = await _seriesService.GetSeriesList();

            var regex = query == "null" ? null : $"(?i)^([{query}])(?-i)";
            var response = seriesList.Select(s => new SeriesResponse(s.Id, s.Title, s.Description, s.WatchedEpisode, s.LastEpisode, s.Duration, s.Rating, s.ImagePath,
                s.ReleaseDate, s.AddedDate, s.ChangedDate, s.OverDate, s.IsOver, s.IsFavorite)).Skip(30 * (page - 1)).Where(s => regex == null || Regex.IsMatch(s.Title, regex)).Take(30);
            var count = await _seriesService.GetAllSeriesCount();
            if (regex != null)
            {
                count = response.Count();
            }

            return Ok(Tuple.Create(response, count));
        }

        [HttpGet("{page:int}/search/{query}")]
        public async Task<ActionResult<List<SeriesResponse>>> GetSeriesListSearch(int page = 1, string? query = null)
        {
            var seriesList = await _seriesService.GetSearchList(query.ToLowerInvariant());

            var response = seriesList.Select(s => new SeriesResponse(s.Id, s.Title, s.Description, s.WatchedEpisode, s.LastEpisode, s.Duration, s.Rating, s.ImagePath,
                s.ReleaseDate, s.AddedDate, s.ChangedDate, s.OverDate, s.IsOver, s.IsFavorite)).Skip(30 * (page - 1)).Take(30);
            var count = await _seriesService.GetAllSeriesCount();
            if (query != null)
            {
                count = response.Count();
            }

            return Ok(Tuple.Create(response, count));
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
            var (series, error) = Series.Create(Guid.NewGuid(), request.AnimeId, request.Title, request.Description, request.WatchedEpisode, request.LastEpisode,
                request.Duration, request.Rating, request.ImagePath, request.ReleaseDate, date, date, date, request.IsOver, request.IsFavorite);

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
            var seriesId = await _seriesService.UpdateSeries(id, request.AnimeId, request.Title, request.Description, request.WatchedEpisode, request.LastEpisode,
                request.Duration, request.Rating, request.ImagePath, request.ReleaseDate, date, date, request.IsOver, request.IsFavorite);
            return Ok(seriesId);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteSeries(Guid id)
        {
            return Ok(await _seriesService.DeleteSeries(id));
        }
    }
}
