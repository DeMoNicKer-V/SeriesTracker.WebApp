namespace SeriesTracker.API.Extensions
{
    public static class ResultExtensions
    {
        public static IResult InternalServerError(this ILogger logger, Exception ex, string message)
        {
            logger.LogError(ex, message);
            return Results.Json(new { Message = "An unexpected error has occurred. Try again later." }, statusCode: StatusCodes.Status500InternalServerError);
        }

        public static IResult NotFoundResponse(this ILogger logger, string message)
        {
            logger.LogWarning(message);
            return Results.Json(new { Message = message }, statusCode: StatusCodes.Status404NotFound);
        }
    }
}
 