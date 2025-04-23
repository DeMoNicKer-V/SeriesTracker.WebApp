using AutoMapper;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using Microsoft.Extensions.Logging;
using SeriesTracker.Core;

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
        /// Выполняет GraphQL-запрос и возвращает результат с использованием функции проекции.
        /// </summary>
        /// <typeparam name="TSource">Тип данных, возвращаемых GraphQL-запросом.</typeparam>
        /// <typeparam name="TResult">Тип данных, которые нужно получить в результате (после применения проекции).</typeparam>
        /// <param name="request">Объект <see cref="GraphQLRequest"/>, представляющий GraphQL-запрос.</param>
        /// <param name="logger">Логгер для записи информации о процессе выполнения запроса.</param>
        /// <returns>Результат GraphQL-запроса типа <typeparamref name="TResult"/>.</returns>
        /// <exception cref="Exception">Выбрасывается, если GraphQL-запрос завершается с ошибками.</exception>
        public static async Task<TResult> ExecuteGraphQLRequest<TSource, TResult>(
           GraphQLRequest request,
           ILogger logger,
           IMapper mapper)
        {
            try
            {
                logger.LogDebug("Sending GraphQL request: {Query}", request.Query);
                var response = await graphQLClient.SendQueryAsync<TSource>(request);

                if (response.Errors != null && response.Errors.Any())
                {
                    logger.LogError("GraphQL request failed with errors: {Errors}", response.Errors);
                    throw new Exception($"GraphQL request failed: {string.Join(", ", response.Errors.Select(e => e.Message))}");
                }
                if (response.Data == null)
                {
                    logger.LogWarning("GraphQL response data is null.");
                    return default;
                }

                logger.LogDebug("Successfully fetched data. Applying mapping.");
                return mapper.Map<TResult>(response.Data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while executing GraphQL request.");
                throw;
            }
        }

        public static async Task<TResult> ExecuteGraphQLRequest<TSource, TResult>(
        GraphQLRequest request,
        ILogger logger)
        {
            try
            {
                logger.LogDebug("Sending GraphQL request: {Query}", request.Query);
                var response = await graphQLClient.SendQueryAsync<TSource>(request);

                if (response.Errors != null && response.Errors.Any())
                {
                    logger.LogError("GraphQL request failed with errors: {Errors}", response.Errors);
                    throw new Exception($"GraphQL request failed: {string.Join(", ", response.Errors.Select(e => e.Message))}");
                }
                if (response.Data == null)
                {
                    logger.LogWarning("GraphQL response data is null.");
                    return default;
                }

                // Если IMapper не предоставлен, просто приводим тип
                return (TResult)(object)response.Data;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while executing GraphQL request.");
                throw;
            }
        }
        /// <summary>
        ///  Вспомогательный метод для случаев, когда не требуется проекция.  Просто возвращает данные как есть.
        /// </summary>
        public static async Task<TSource> ExecuteGraphQLRequest<TSource>(GraphQLRequest request, ILogger logger)
        {
            return await ExecuteGraphQLRequest<TSource, TSource>(request, logger);
        }
    }
}