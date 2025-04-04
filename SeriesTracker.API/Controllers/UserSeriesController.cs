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

        [HttpGet("{userName}")]
        public async Task<IResult> GetUserProfileInfo(string userName)
        {
            // Модель автоматически валидируется ASP.NET Core, поэтому проверка ModelState.IsValid не требуется.

            try
            {
                var userProfileInfo = await _userSeriesService.GetUserProfile(userName);

                if (userProfileInfo == null)
                {
                    return _logger.NotFoundResponse(
                      message: $"User ({userName}) not found");
                }
                return Results.Ok(userProfileInfo);
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, "An unexpected error occurred while getting user's profile");
            }
        }

        [HttpGet("{userName}/group")]
        public async Task<IResult> GetGroupedSeries(string userName)
        {
            // Модель автоматически валидируется ASP.NET Core, поэтому проверка ModelState.IsValid не требуется.

            try
            {
                var categoryGroup = await _userSeriesService.GetGroupShortSeries(userName);
                return Results.Ok(categoryGroup);
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, "An unexpected error occurred while receiving this user's list.");
            }
        }

        [HttpGet("{userName}/list/{page}")]
        public async Task<IResult> GetAnimesByUser(string userName, int page, [FromQuery] UserSeriesRequest request)
        {
            // Модель автоматически валидируется ASP.NET Core, поэтому проверка ModelState.IsValid не требуется.

            try
            {
                var userSeries = await _userSeriesService.GetUserSeriesList(userName, page, request.MyList, request.IsFavorite);
                return Results.Ok(userSeries);
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, "An unexpected error occurred while receiving this user's list.");
            }
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
                    loggerMessage: $"The user with ID:{userId} have updated series with animeID:{request.AnimeId}.");
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
                    loggerMessage: $"The user with ID:{userId} have deleted series with ID:{id} from his list.");
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