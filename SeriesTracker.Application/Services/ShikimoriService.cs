using GraphQL;
using GraphQL.Client.Abstractions;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using SeriesTracker.Core.Models.Shikimori;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using System.Xml.Linq;

namespace SeriesTracker.Application.Services
{
    public class ShikimoriService : IShikimoriService
    {
        private static readonly string apiUrl = "https://shikimori.one/api/graphql";
        private readonly GraphQLHttpClient graphQLClient;

        public ShikimoriService()
        {
            graphQLClient = new GraphQLHttpClient(apiUrl, new NewtonsoftJsonSerializer());
        }

        public async Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimes(int page, string order)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeBaseList>(GetAnimesRequest(page, order));
        }

        public async Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimesByName(string name)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeList>(GetByNameRequest(name));
        }

        public async Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimeById(string Id)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeList>(GetRequest(Id));
        }

        public async Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimesByAllParams(int page, string name, string season, string status, string kind, string genre, string order, bool censored)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeBaseList>(GetRequest(page, name, season, status, kind, genre, order, censored));
        }

        public async Task<GraphQLResponse<GenreList>> GetGenres()
        {
            return await graphQLClient.SendQueryAsync<GenreList>(GetRequest());
        }

        public async Task<GraphQLResponse<ShikimoriAnimeList>> GetRandomAnime()
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeList>(RandomRequest());
        }

        private static GraphQLRequest GetAnimesRequest(int page, string order)
        {
            return new GraphQLRequest
            {
                Query = @"query GetAll($page: Int, $order: OrderEnum) {
                                animes(page: $page, order: $order, kind: ""!music,!pv,!cm"", status: ""!anons"",  limit: 28) {
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
                                        mainUrl
                                        originalUrl
                                    }
                                }
                            }",
                OperationName = "GetAll",
                Variables = new
                {
                    page,
                    order
                }
            };
        }

        private static GraphQLRequest GetRequest()
        {
            return new GraphQLRequest
            {
                Query = @"query GetGenres() {
                                genres(entryType: Anime) {
                                    id
                                    russian
                                    kind
                                }
                            }",
                OperationName = "GetGenres",
            };
        }

        private static GraphQLRequest RandomRequest()
        {
            return new GraphQLRequest
            {
                Query = @"query GetRandom() {
                                animes(order: random, score: 1, kind: ""!music,!pv,!cm"") {
                                    id
                                }
                            }",
                OperationName = "GetRandom",

            };
        }


        private static GraphQLRequest GetByNameRequest(string name)
        {
            return new GraphQLRequest
            {
                Query = @"query GetByName($name: String) {
                                animes(search: $name, kind: ""!music,!pv,!cm"", status: ""!anons"", limit: 5) {
                                    id
                                    russian
                                    name
                                    kind
                                    rating
                                    episodes
                                    episodesAired
                                    genres{ id kind russian }
                                    status
                                    score
                                    airedOn {
                                        date
                                    }
                                    poster {
                                        mainUrl
                                    }
                                }
                            }",
                OperationName = "GetByName",
                Variables = new
                {
                    name,
                }
            };
        }

        private static GraphQLRequest GetRequest(int page, string name, string season, string status, string kind, string genre, string order, bool censored)
        {

            return new GraphQLRequest
            {
                Query = @"query GetByAllParams($page: Int, $name: String, $season: SeasonString, $status: AnimeStatusString, $kind: AnimeKindString, $genre: String, $order: OrderEnum, $censored: Boolean) {
                                animes(page: $page, search: $name, season: $season, status: $status, kind: $kind, genre: $genre, order: $order, censored: $censored, score: 1, limit: 28) {
                                    id
                                    russian
                                    name
                                    description
                                    kind
                                    rating
                                    duration
                                    episodes
                                    genres{ id kind russian }
                                    episodesAired
                                    status
                                    score
                                    airedOn {
                                        date
                                    }
                                    poster {
                                        
                                        mainUrl
                                    }
                                }
                            }",
                OperationName = "GetByAllParams",
                Variables = new
                {
                    page = page,
                    name = name,
                    season = season,
                    status = string.IsNullOrEmpty(status) ? "!anons" : status,
                    kind = string.IsNullOrEmpty(kind) ? "!music,!pv,!cm" : kind,
                    genre = genre,
                    order = order,
                    censored = censored
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
                                    genres{ id kind russian }
                                    episodesAired
                                    status
                                    score
   screenshots { id originalUrl}
    related {
      anime {
                           id
    name
    russian
    poster {miniUrl}
    kind
airedOn{year}
      }
      relationText
    }
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
                    id,
                }
            };
        }
    }
}
