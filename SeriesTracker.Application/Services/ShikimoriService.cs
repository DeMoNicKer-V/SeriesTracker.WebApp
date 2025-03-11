using AutoMapper;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Application.Services
{
    public class ShikimoriService : IShikimoriService
    {
        private static readonly string apiUrl = "https://shikimori.one/api/graphql";
        private readonly GraphQLHttpClient graphQLClient;

        private readonly IMapper _mapper;

        public ShikimoriService(IMapper mapper)
        {
            _mapper = mapper;


            graphQLClient = new GraphQLHttpClient(apiUrl, new NewtonsoftJsonSerializer());
        }

        public AnimeFullDto MapToFullDto(ShikimoriAnimeBase anime)
        {
            return _mapper.Map<AnimeFullDto>(anime);
        }

        public AnimeShortDto MapToShortDto(ShikimoriAnimeBase anime)
        {
            return _mapper.Map<AnimeShortDto>(anime);
        }

        public AnimeSeriesDto MapToAnimeSeriesDto(ShikimoriAnimeBase anime, int categoryId, string categoryName, string categoryColor)
        {
            return _mapper.Map<AnimeSeriesDto>(anime, opt =>
            {
                opt.Items["CategoryId"] = categoryId;
                opt.Items["CategoryName"] = categoryName;
                opt.Items["CategoryColor"] = categoryColor;
            });
        }

        public object MapToAnimeSeriesFullDto(ShikimoriAnimeBase anime, SeriesCategoryDto? series, bool isFull)
        {
            if (series == null)
            {
                return isFull ? _mapper.Map<AnimeFullDto>(anime) : _mapper.Map<AnimeShortDto>(anime);
            }
            return _mapper.Map<AnimeSeriesFullDto>(anime, opt =>
            {

                opt.Items["SeriesId"] = series.SeriesId;
                opt.Items["CategoryId"] = series.CategoryId;
                opt.Items["CategoryName"] = series.CategoryName;
                opt.Items["CategoryColor"] = series.CategoryColor;
                opt.Items["WatchedEpisodes"] = series.WatchedEpisodes;
                opt.Items["AddedDate"] = series.AddedDate;
                opt.Items["IsFavorite"] = series.IsFavorite;
                opt.Items["ChangedDate"] = series.ChangedDate;

            });
        }

        public async Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimes(int page, string order)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeBaseList>(GetAnimesRequest(page, order));
        }

        public async Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimesByName(string name)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeBaseList>(GetAnimeByNameRequest(name));
        }

        public async Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimeById(string Id)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeBaseList>(GetAnimeByIdRequest(Id));
        }

        public async Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimeListByIds(string Id)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeBaseList>(GetAnimeListByIdsRequest(Id));
        }

        public async Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimesByAllParams(int page, string name, string season, string status, string kind, string genre, string order, bool censored)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeBaseList>(GetAnimesParamsRequest(page, name, season, status, kind, genre, order, censored));
        }

        public async Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetAnimesByAllParamsAndIds(int page, string name, string ids, string season, string status, string kind, string genre, string order, bool censored)
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeBaseList>(GetAnimesParamsIdsRequest(page, name, ids, season, status, kind, genre, order, censored));
        }

        public async Task<GraphQLResponse<GenreList>> GetGenres()
        {
            return await graphQLClient.SendQueryAsync<GenreList>(GetGenresRequest());
        }

        public async Task<GraphQLResponse<ShikimoriAnimeBaseList>> GetRandomAnime()
        {
            return await graphQLClient.SendQueryAsync<ShikimoriAnimeBaseList>(GetRandomAnimeRequest());
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

        private static GraphQLRequest GetGenresRequest()
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


        private static GraphQLRequest GetRandomAnimeRequest()
        {
            return new GraphQLRequest
            {
                Query = @"query GetRandom() {
                                animes(order: random, score: 6, kind: ""ova,ona,tv,movie"", status: ""!anons"") {
                                    id
                                }
                            }",
                OperationName = "GetRandom",

            };
        }


        private static GraphQLRequest GetAnimeByNameRequest(string name)
        {
            return new GraphQLRequest
            {
                Query = @"query GetByName($name: String) {
                                animes(search: $name, kind: ""!music,!pv,!cm"", status: ""!anons"", censored: true, limit: 5) {
                                    id
                                    russian
                                    name
                                    kind
                                    episodes
                                    episodesAired
                                    status
                                    airedOn {
                                        year
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

        private static GraphQLRequest GetAnimesParamsIdsRequest(int page, string name, string ids, string season, string status, string kind, string genre, string order, bool censored)
        {

            return new GraphQLRequest
            {
                Query = @"query GetByAllParams($page: Int, $ids: String, $name: String, $season: SeasonString, $status: AnimeStatusString, $kind: AnimeKindString, $genre: String, $order: OrderEnum, $censored: Boolean) {
                                animes(page: $page, ids: $ids, search: $name, season: $season, status: $status, kind: $kind, genre: $genre, order: $order, censored: $censored, score: 1, limit: 28) {
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
                    ids = ids,
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

        private static GraphQLRequest GetAnimesParamsRequest(int page, string name, string season, string status, string kind, string genre, string order, bool censored)
        {

            return new GraphQLRequest
            {
                Query = @"query GetByAllParams($page: Int, $name: String, $season: SeasonString, $status: AnimeStatusString, $kind: AnimeKindString, $genre: String, $order: OrderEnum, $censored: Boolean) {
                                animes(page: $page, search: $name, season: $season, status: $status, kind: $kind, genre: $genre, order: $order, censored: $censored, score: 1, limit: 22) {
                                    id
                                    russian
                                    name
                                    description
                                    kind
                                    rating
                                    duration
                                    episodes
                                    episodesAired
                                    status
                                    score
                                    airedOn {
                                        year
                                    }
                                    poster {
                                        mainUrl
                                        mainAltUrl
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

        private static GraphQLRequest GetAnimeByIdRequest(string id)
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
                                        poster {mini2xUrl}
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

        private static GraphQLRequest GetAnimeListByIdsRequest(string id)
        {
            return new GraphQLRequest
            {
                Query = @"query GetListById($id: String) {
                                animes(ids: $id, limit: 28) {
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
                OperationName = "GetListById",
                Variables = new
                {
                    id,
                }
            };
        }

        private static GraphQLRequest GetOngoingList(int page)
        {
            return new GraphQLRequest
            {
                Query = @"query GetListById($page: Int) {
                                animes(status: ""ongoing"" limit: 50, page: $page) {
                                    id
                                    russian
                                    name
                                    episodes
                                    episodesAired
                                    nextEpisodeAt
                                    poster {
                                        mainUrl
                                    }
                                }
                            }",
                OperationName = "GetListById",
                Variables = new
                {
                    page,
                }
            };
        }
    }
}
