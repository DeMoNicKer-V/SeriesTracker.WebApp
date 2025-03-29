using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.API.Extensions;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Infrastructure.Authentication;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("series")]
    public class UserSeriesController(IUserSeriesService userSeriesService, ILogger<UserSeriesController> logger) : ControllerBase
    {
        private readonly ILogger<UserSeriesController> _logger = logger;
        private readonly IUserSeriesService _userSeriesService = userSeriesService;


        [HttpGet("categoryCount")]
        public async Task<IResult> GetGroupedSeries(string userName)
        {
            var categoryGroup = await _userSeriesService.GetGroupShortSeries(userName);
            return Results.Ok(categoryGroup);
        }

        [HttpGet("{usermame}/list")]
        public async Task<IResult> GetAnimesByUser([FromQuery] UserSeriesRequest request, string usermame)
        {
            var userSeries = await _userSeriesService.GetAnimeIdsString(usermame, request.Page, request.MyList, request.IsFavorite);

            if (userSeries == null)
            {
                return Results.Ok(Array.Empty<object>());
            }
            return Results.Ok(userSeries);
        }

        [RequirePermission(Permission.Read)]
        [HttpPost("create")]
        public async Task<IResult> CreateSeries([FromBody] CreateSeriesRequest request)
        {
            // Модель автоматически валидируется ASP.NET Core, поэтому проверка ModelState.IsValid не требуется.

            try
            {
                Guid userId = GetUserIdFromClaims();
                var createdSeriesId = await _userSeriesService.CreateAsync(
                    Guid.NewGuid(), userId, request.AnimeId, request.CategoryId,
                    request.WatchedEpisode, request.IsFavorite);

                return _logger.CreatedResponse(
                    logggerMessage: $"The user with ID:{userId} have added anime with ID:{request.AnimeId} to his list.",
                    resultMessage: "You have added anime to your list.");
            }
            catch (UnauthorizedAccessException)
            {
                return _logger.UnauthorizedResponse("You must be authorized to add anime to your list.", nameof(CreateSeries));
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, "An unexpected error occurred while adding anime to list.");
            }
        }

        [RequirePermission(Permission.Read)]
        [HttpPut("update/{id:guid}")]
        public async Task<IResult> UpdateSeries(Guid id, [FromBody] CreateSeriesRequest request)
        {
            // Модель автоматически валидируется ASP.NET Core, поэтому проверка ModelState.IsValid не требуется.

            try
            {
                Guid userId = GetUserIdFromClaims();
                var updatedSeriesId = await _userSeriesService.UpdateSeries(id, request.WatchedEpisode, 
                    request.CategoryId, request.IsFavorite);

                return _logger.NoContentResponse(
                    logggerMessage: $"The user with ID:{userId} have updated series with animeID:{request.AnimeId}.", 
                    resultMessage: "You have updated series.");
            }
            catch (UnauthorizedAccessException)
            {
                return _logger.UnauthorizedResponse("You must be authorized to update series.", nameof(UpdateSeries));
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, "An unexpected error occurred while updating series.");
            }
        }

        [RequirePermission(Permission.Read)]
        [HttpDelete("delete/{id:guid}")]
        public async Task<IResult> DeleteSeries(Guid id)
        {
            try
            {
                Guid userId = GetUserIdFromClaims();
                var deletedSeriesId = await _userSeriesService.DeleteSeries(id);

                return _logger.NoContentResponse(
                    logggerMessage: $"The user with ID:{userId} have deleted series with ID:{id} from his list.", 
                    resultMessage:"You have deleted series.");
            }
            catch (UnauthorizedAccessException)
            {
                return _logger.UnauthorizedResponse("You must be authorized to delete series.", nameof(DeleteSeries));
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, "An unexpected error occurred while deleting series.");
            }
        }

        private Guid GetUserIdFromClaims()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;

            if (Guid.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }

            throw new UnauthorizedAccessException("User ID not found in claims.");
        }
    }
}