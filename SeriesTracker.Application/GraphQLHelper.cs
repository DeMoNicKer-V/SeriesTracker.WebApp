using GraphQL;
using GraphQL.Client.Abstractions;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using Microsoft.Extensions.Logging;

namespace SeriesTracker.Application
{
    public static class GraphQLHelper
    {
        private static readonly string apiUrl = "https://shikimori.one/api/graphql";

        private static readonly GraphQLHttpClient graphQLClient = new GraphQLHttpClient(apiUrl, new NewtonsoftJsonSerializer());
        public static async Task<TResult> ExecuteGraphQLRequest<TResult>(
            GraphQLRequest request,
            ILogger logger)
        {
            try
            {
                logger.LogDebug("Sending GraphQL request: {Query}", request.Query);
                var response = await graphQLClient.SendQueryAsync<TResult>(request);

                if (response.Errors != null && response.Errors.Any())
                {
                    logger.LogError("GraphQL request failed with errors: {Errors}", response.Errors);
                    throw new Exception($"GraphQL request failed: {string.Join(", ", response.Errors.Select(e => e.Message))}");
                }

                logger.LogDebug("Successfully fetched data.");
                return response.Data;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while executing GraphQL request.");
                throw; // Re-throw the exception
            }
        }
    }
}
