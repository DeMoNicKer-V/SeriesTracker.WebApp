namespace SeriesTracker.API.Extensions
{
    /// <summary>
    /// Расширения для упрощения создания ответов API с использованием IResult.
    /// Предоставляет методы для возврата стандартизированных ответов с кодами состояния HTTP и сообщениями об ошибках.
    /// </summary>
    public static class ResultExtensions
    {
        /// <summary>
        /// Возвращает ответ с кодом состояния HTTP 400 Bad Request.
        /// </summary>
        /// <param name="logger">Логгер для записи информации об ошибке.</param>
        /// <param name="logMessage">Сообщение для логгера.</param>
        /// <param name="resultMessage">Сообщение, которое будет возвращено в теле ответа клиенту.</param>
        /// <param name="exeption">Исключение, которое необходимо залогировать (опционально).</param>
        /// <returns>IResult с кодом состояния 400 Bad Request и JSON-сообщением.</returns>
        public static IResult BadResponse(this ILogger logger, string logMessage, string resultMessage, Exception? exeption = null)
        {
            if (exeption != null)
            {
                logger.LogError(exeption, logMessage);
            }
            else { logger.LogError(logMessage); }

            return Results.Json(new { Message = resultMessage }, statusCode: StatusCodes.Status400BadRequest);
        }

        /// <summary>
        /// Возвращает ответ с кодом состояния HTTP 201 Created.
        /// </summary>
        /// <param name="logger">Логгер для записи информации об успешном создании ресурса.</param>
        /// <param name="logMessage">Сообщение для логгера.</param>
        /// <param name="resultMessage">Сообщение, которое будет возвращено в теле ответа клиенту.</param>
        /// <returns>IResult с кодом состояния 201 Created и JSON-сообщением.</returns>
        public static IResult CreatedResponse(this ILogger logger, string logMessage, string resultMessage)
        {
            logger.LogInformation(logMessage);
            return Results.Json(new { Message = resultMessage }, statusCode: StatusCodes.Status201Created);
        }

        /// <summary>
        /// Возвращает ответ с кодом состояния HTTP 500 Internal Server Error.
        /// </summary>
        /// <param name="logger">Логгер для записи информации о критической ошибке.</param>
        /// <param name="exception">Исключение, которое необходимо залогировать.</param>
        /// <param name="logMessage">Сообщение для логгера.</param>
        /// <returns>IResult с кодом состояния 500 Internal Server Error и JSON-сообщением.</returns>
        public static IResult InternalServerError(this ILogger logger, Exception exception, string logMessage)
        {
            logger.LogCritical(exception, logMessage);
            return Results.Json(new { Message = "An unexpected error has occurred. Try again later." }, statusCode: StatusCodes.Status500InternalServerError);
        }

        /// <summary>
        /// Возвращает ответ с кодом состояния HTTP 204 No Content.
        /// </summary>
        /// <param name="logger">Логгер для записи информации об успешном выполнении запроса (опционально).</param>
        /// <param name="loggerMessage">Сообщение для логгера (опционально).</param>
        /// <returns>IResult с кодом состояния 204 No Content.</returns>
        public static IResult NoContentResponse(this ILogger logger, string? loggerMessage = null)
        {
            if (!string.IsNullOrEmpty(loggerMessage))
            {
                logger.LogInformation(loggerMessage);
            }
            return Results.NoContent();
        }

        /// <summary>
        /// Возвращает ответ с кодом состояния HTTP 404 Not Found.
        /// </summary>
        /// <param name="logger">Логгер для записи информации об отсутствии ресурса.</param>
        /// <param name="message">Сообщение, которое будет возвращено в теле ответа клиенту.</param>
        /// <returns>IResult с кодом состояния 404 Not Found и JSON-сообщением.</returns>
        public static IResult NotFoundResponse(this ILogger logger, string message)
        {
            logger.LogWarning(message);
            return Results.Json(new { Message = message }, statusCode: StatusCodes.Status404NotFound);
        }

        /// <summary>
        /// Возвращает ответ с кодом состояния HTTP 401 Unauthorized.
        /// </summary>
        /// <param name="logger">Логгер для записи информации о попытке неавторизованного доступа.</param>
        /// <param name="message">Сообщение, которое будет возвращено в теле ответа клиенту.</param>
        /// <param name="methodName">Название метода, к которому была предпринята попытка неавторизованного доступа.</param>
        /// <returns>IResult с кодом состояния 401 Unauthorized и JSON-сообщением.</returns>
        public static IResult UnauthorizedResponse(this ILogger logger, string message, string methodName)
        {
            logger.LogWarning("Unauthorized access attempt to method: {methodName}.", methodName);
            return Results.Json(new { Message = message }, statusCode: StatusCodes.Status401Unauthorized);
        }
    }
}