using GraphQL;

namespace SeriesTracker.Application
{
    /// <summary>
    /// Содержит статические GraphQL-запросы для получения данных из API Shikimori.
    /// Каждый метод возвращает объект <see cref="GraphQLRequest"/>, представляющий собой запрос.
    /// </summary>
    public static class GraphQLQueries
    {
        /// <summary>
        /// Возвращает GraphQL-запрос для поиска аниме по ID.
        /// </summary>
        /// <param name="id">ID аниме для поиска.</param>
        /// <returns>Объект <see cref="GraphQLRequest"/> для поиска аниме по ID.</returns>
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

        /// <summary>
        /// Возвращает GraphQL-запрос для поиска по входным параметрам.
        /// </summary>
        /// <param name="page">Текущая страница.</param>
        /// <param name="name">Название аниме.</param>
        /// <param name="season">Сезон выхода.</param>
        /// <param name="status">Статус выхода.</param>
        /// <param name="kind">Тип аниме.</param>
        /// <param name="genre">Жанры аниме.</param>
        /// <param name="order">Порядок сортировки.</param>
        /// <param name="censored">Безопасный поиск.</param>
        /// <returns>Объект <see cref="GraphQLRequest"/> для поиска по входным параметрам.</returns>
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

        /// <summary>
        /// Возвращает GraphQL-запрос для поиска по списку ID.
        /// </summary>
        /// <param name="ids">Список ID (в виде строки).</param>
        /// <returns>Объект <see cref="GraphQLRequest"/> для поиска аниме по списку ID  (в виде строки).</returns>
        public static GraphQLRequest GetAnimesByIds(string ids)
        {
            return new GraphQLRequest
            {
                Query = @"query GetAnimesByIds($ids: String) {
                                animes(ids: $ids, limit: 22) {
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
                }
            };
        }

        /// <summary>
        /// Возвращает GraphQL-запрос для поиска аниме по имени.
        /// </summary>
        /// <param name="name">Имя аниме для поиска.</param>
        /// <returns>Объект <see cref="GraphQLRequest"/> для поиска аниме по имени.</returns>
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

        /// <summary>
        /// Возвращает GraphQL-запрос для получения списка жанров аниме.
        /// </summary>
        /// <returns>Объект <see cref="GraphQLRequest"/> для получения списка жанров аниме.</returns>
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

        /// <summary>
        /// Возвращает GraphQL-запрос для получения случайного аниме.
        /// </summary>
        /// <returns>Объект <see cref="GraphQLRequest"/> для получения случайного аниме.</returns>
        public static GraphQLRequest GetRandomAnime()
        {
            return new GraphQLRequest
            {
                Query = @"query GetRandomAnime() {
                                 animes(order: random, score: 6, kind: ""ova,ona,tv,movie"", status: ""!anons"", limit: 1) {
                                     id
                                 }
                             }",
                OperationName = "GetRandomAnime",
            };
        }
    }
}