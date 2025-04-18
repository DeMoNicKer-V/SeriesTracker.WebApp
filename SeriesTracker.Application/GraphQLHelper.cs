using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using Microsoft.Extensions.Logging;

namespace SeriesTracker.Application
{
    /// <summary>
    /// Статический класс-хелпер для выполнения GraphQL-запросов к API Shikimori.
    /// </summary>
    public static class GraphQLHelper
    {
        private static readonly string apiUrl = "https://shikimori.one/api/graphql";

        private static readonly GraphQLHttpClient graphQLClient = new GraphQLHttpClient(apiUrl, new NewtonsoftJsonSerializer());

        /// <summary>
        /// Выполняет GraphQL-запрос и возвращает результат.
        /// </summary>
        /// <typeparam name="TResult">Тип ожидаемого результата GraphQL-запроса.</typeparam>
        /// <param name="request">Объект <see cref="GraphQLRequest"/>, представляющий GraphQL-запрос.</param>
        /// <param name="logger">Логгер для записи информации о процессе выполнения запроса.</param>
        /// <returns>Результат GraphQL-запроса типа <typeparamref name="TResult"/>.</returns>
        /// <exception cref="Exception">Выбрасывается, если GraphQL-запрос завершается с ошибками.</exception>
        public static async Task<TResult> ExecuteGraphQLRequest<TResult>(
            GraphQLRequest request,
            ILogger logger)
        {
            try
            {
                // Отправляем GraphQL-запрос и логируем отправленный запрос.
                logger.LogDebug("Sending GraphQL request: {Query}", request.Query);
                var response = await graphQLClient.SendQueryAsync<TResult>(request);

                // Проверяем наличие ошибок в ответе GraphQL.
                if (response.Errors != null && response.Errors.Any())
                {
                    logger.LogError("GraphQL request failed with errors: {Errors}", response.Errors);
                    throw new Exception($"GraphQL request failed: {string.Join(", ", response.Errors.Select(e => e.Message))}");
                }

                // Логируем успешное получение данных и возвращаем результат.
                logger.LogDebug("Successfully fetched data.");
                return response.Data;
            }
            catch (Exception ex)
            {
                // Логируем произошедшую ошибку и пробрасываем исключение выше.
                logger.LogError(ex, "An error occurred while executing GraphQL request.");
                throw;
            }
        }
}
}
