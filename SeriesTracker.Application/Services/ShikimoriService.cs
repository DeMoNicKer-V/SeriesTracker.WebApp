using GraphQL;
using GraphQL.Client.Abstractions;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using SeriesTracker.Core.Models.Shikimori;
using SeriesTracker.Core.Abstractions;

namespace SeriesTracker.Application.Services
{
    public class ShikimoriService: IShikimoriService
    {
        private static readonly string apiUrl = "https://shikimori.one/api/graphql";
        private readonly GraphQLHttpClient graphQLClient;

        public ShikimoriService()
        {
            graphQLClient = new GraphQLHttpClient(apiUrl, new NewtonsoftJsonSerializer());
        }

        public async Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimes(int page)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeList>(GetRequest(page));
        }

        public async Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimesByName(int page, string name)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeList>(GetRequest(page, name));
        }

        public async Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimeById(string Id)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeList>(GetRequest(Id));
        }

        private static GraphQLRequest GetRequest(int page)
        {
            return new GraphQLRequest
            {
                Query = @"query GetAll($page: Int) {
                                animes(page: $page, limit: 30) {
                                    id
                                    russian
                                    name
                                    description
                                    kind
                                    rating
                                    duration
                                    genres{ id name russian }
                                    episodes
                                    episodesAired
                                    status
                                    score
                                    airedOn {
                                        date
                                    }
                                    poster {
                                        originalUrl
                                    }
                                }
                            }",
                OperationName = "GetAll",
                Variables = new
                {
                    page
                }
            };
        }

        private static GraphQLRequest GetRequest(int page, string name)
        {
            return new GraphQLRequest
            {
                Query = @"query GetByName($name: String, $page: Int) {
                                animes(search: $name, page: $page, limit: 30) {
                                    id
                                    russian
                                    name
                                    description
                                    kind
                                    rating
                                    duration
                                    episodes
                                    genres{ id name russian }
                                    episodesAired
                                    status
                                    score
                                    airedOn {
                                        date
                                    }
                                    poster {
                                        originalUrl
                                    }
                                }
                            }",
                OperationName = "GetByName",
                Variables = new
                {
                    name,
                    page
                }
            };
        }

        private static GraphQLRequest GetRequest(string id)
        {
            return new GraphQLRequest
            {
                Query = @"query GetById($id: String) {
                                animes(ids: $id) {
                                    id
                                    russian
                                    name
                                    description
                                    kind
                                    rating
                                    duration
                                    episodes
                                    genres{ id name russian }
                                    episodesAired
                                    status
                                    score
                                    airedOn {
                                        date
                                    }
                                    poster {
                                        originalUrl
                                    }
                                }
                            }",
                OperationName = "GetById",
                Variables = new
                {
                    id
                }
            };
        }
    }
}
