using GraphQL.Client.Abstractions;
using GraphQL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Application.Services
{
    public abstract class BaseShikimoriService
    {
        protected readonly IGraphQLClient _graphQLClient;

        protected BaseShikimoriService(IGraphQLClient graphQLClient)
        {
            _graphQLClient = graphQLClient;
        }

        protected async Task<GraphQLResponse<T>> SendQueryAsync<T>(GraphQLRequest request)
        {
            return await _graphQLClient.SendQueryAsync<T>(request);
        }
    }
}
