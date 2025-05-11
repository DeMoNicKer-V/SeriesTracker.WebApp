using AutoMapper;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using Microsoft.Extensions.Logging;

namespace SeriesTracker.Application
{
    /// <summary>
    /// Класс-хелпер для выполнения GraphQL-запросов к API Shikimori.
    /// </summary>
    public class GraphQLHelper : IGraphQLHelper
    {
        private static readonly string apiUrl = "https://shikimori.one/api/graphql";

        private static readonly GraphQLHttpClient graphQLClient = new GraphQLHttpClient(apiUrl, new NewtonsoftJsonSerializer());

        public async Task<TResult?> ExecuteGraphQLRequest<TSource, TResult>(
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

        public async Task<TResult?> ExecuteGraphQLRequest<TSource, TResult>(
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

        public async Task<TSource?> ExecuteGraphQLRequest<TSource>(GraphQLRequest request, ILogger logger)
        {
            return await ExecuteGraphQLRequest<TSource, TSource>(request, logger);
        }
    }
}