﻿using GraphQL;
using GraphQL.Client.Abstractions;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using SeriesTracker.Core.Models.Shikimori;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;

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

        public async Task<GraphQLResponse<ShikimoriAnimeList>> GetAnimesByAllParams(int page, string name, string season, string status, string kind, string genre)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeList>(GetRequest(page, name, season, status, kind, genre));
        }

        public async Task<GraphQLResponse<GenreList>> GetGenres()
        {
            return await graphQLClient.SendQueryAsync<GenreList>(GetRequest());
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

        private static GraphQLRequest GetRequest()
        {
            return new GraphQLRequest
            {
                Query = @"query GetGenres() {
                                genres(entryType: Anime) {
                                    id
                                    russian
                                }
                            }",
                OperationName = "GetGenres",
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
                                        mainUrl
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

        private static GraphQLRequest GetRequest(int page, string name, string season, string status,string kind, string genre)
        {
            return new GraphQLRequest
            {
                Query = @"query GetByAllParams($page: Int, $name: String, $season: SeasonString, $status: AnimeStatusString, $kind: AnimeKindString, $genre: String) {
                                animes(page: $page, search: $name, season: $season, status: $status, kind: $kind, genre: $genre, limit: 30) {
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
                    status = status,
                    kind = kind,
                    genre = genre
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
                                        
                                        mainUrl
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
