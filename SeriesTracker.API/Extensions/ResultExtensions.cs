using System.Reflection;

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

        public static IResult CreatedResponse(this ILogger logger, string logggerMessage, string resultMessage)
        {
            logger.LogInformation(logggerMessage);
            return Results.Json(new { Message = resultMessage }, statusCode: StatusCodes.Status201Created);
        }

        public static IResult NoContentResponse(this ILogger logger, string? loggerMessage = null)
        {
            if(!string.IsNullOrEmpty(loggerMessage)) 
            { 
                logger.LogInformation(loggerMessage); 
            }
            return Results.NoContent();
        }

        public static IResult UnauthorizedResponse(this ILogger logger, string message, string methodName)
        {
            logger.LogWarning("Unauthorized access attempt to method: {methodName}.", methodName);
            return Results.Json(new { Message = message }, statusCode: StatusCodes.Status401Unauthorized);
        }

        public static IResult BadResponse(this ILogger logger, Exception ex, string message, string resultMessage)
        {
            logger.LogError(ex, message);
            return Results.Json(new { Message = resultMessage }, statusCode: StatusCodes.Status400BadRequest);
        }
    }
}
 