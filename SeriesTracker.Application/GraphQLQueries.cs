using GraphQL;

namespace SeriesTracker.Application
{
    public static class GraphQLQueries
    {
        public static GraphQLRequest GetGenres()
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


        public static GraphQLRequest GetRandomAnime()
        {
            return new GraphQLRequest
            {
                Query = @"query GetRandomAnime() {
                                animes(order: random, score: 6, kind: ""ova,ona,tv,movie"", status: ""!anons"") {
                                    id
                                }
                            }",
                OperationName = "GetRandomAnime",

            };
        }


        public static GraphQLRequest GetAnimesByName(string name)
        {
            return new GraphQLRequest
            {
                Query = @"query GetAnimesByName($name: String) {
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
                OperationName = "GetAnimesByName",
                Variables = new
                {
                    name = name,
                }
            };
        }

        public static GraphQLRequest GetAnimesByIds(int page, string name, string ids, string season, 
            string status, string kind, string genre, string order, bool censored)
        {

            return new GraphQLRequest
            {
                Query = @"query GetAnimesByIds($page: Int, $ids: String, $name: String, $season: SeasonString, $status: AnimeStatusString, $kind: AnimeKindString, $genre: String, $order: OrderEnum, $censored: Boolean) {
                                animes(page: $page, ids: $ids, search: $name, season: $season, status: $status, kind: $kind, genre: $genre, order: $order, censored: $censored, score: 1, limit: 22) {
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
                OperationName = "GetAnimesByIds",
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

        public static GraphQLRequest GetAnimes(int page, string name, string season, string status, string kind, string genre, string order, bool censored)
        {

            return new GraphQLRequest
            {
                Query = @"query GetAnimes($page: Int, $name: String, $season: SeasonString, $status: AnimeStatusString, $kind: AnimeKindString, $genre: String, $order: OrderEnum, $censored: Boolean) {
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
                OperationName = "GetAnimes",
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

        public static GraphQLRequest GetAnimeById(string id)
        {
            return new GraphQLRequest
            {
                Query = @"query GetAnimeById($id: String) {
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
                OperationName = "GetAnimeById",
                Variables = new
                {
                   id = id,
                }
            };
        }

        public static GraphQLRequest GetRecentAnimes(string id)
        {
            return new GraphQLRequest
            {
                Query = @"query GetRecentAnimes($id: String) {
                                animes(ids: $id, limit: 22) {
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
                OperationName = "GetRecentAnimes",
                Variables = new
                {
                   id = id,
                }
            };
        }
    }
}
