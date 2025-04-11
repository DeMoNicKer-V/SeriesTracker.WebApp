using AutoMapper;
using Microsoft.Extensions.Logging;
using SeriesTracker.Application.Extensions;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Application.Services
{
    /// <summary>
    /// Сервис для работы с данными аниме из Shikimori API.
    /// Предоставляет методы для получения и обработки данных об аниме;
    /// </summary>
    public class ShikimoriService : IShikimoriService
    {
        private readonly ICategorySeriesRepository _categorySeriesRepository;
        private readonly ILogger<ShikimoriService> _logger;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="ShikimoriService"/>.
        /// </summary>
        /// <param name="mapper">Экземпляр IMapper для маппинга объектов.</param>
        /// <param name="logger">Экземпляр ILogger для логирования.</param>
        /// <param name="categorySeriesRepository">Репозиторий для работы с категориями и сериями.</param>
        /// <param name="userRepository">Репозиторий для работы с пользователями.</param>
        public ShikimoriService(IMapper mapper, ILogger<ShikimoriService> logger,
            ICategorySeriesRepository categorySeriesRepository, IUserRepository userRepository)
        {
            _logger = logger;
            _mapper = mapper;
            _categorySeriesRepository = categorySeriesRepository;
            _userRepository = userRepository;
        }

        /// <summary>
        /// Получает список аниме по Id
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="animeId">Id аниме для поиска.</param>
        /// <returns>Массив <see cref="AnimeSeriesFullDto"/>, соответствующих запросу.</returns>
        public async Task<AnimeSeriesFullDto> GetAnimeById(Guid userId, string animeId)
        {
            var result = await GetAndMapAnimeData(
                userId: userId,
                request: GraphQLQueries.GetAnimeById(animeId),
                mapFunc: _mapper.MapToFullSeriesDto);

            return result.Single(); // Используем Single() для получения одного элемента
        }

        /// <summary>
        /// Получает список аниме конкретного пользователя в порядке изменения
        /// </summary>
        /// <param name="userName">Никнейм пользователя.</param>
        /// <param name="Ids">Список id последних измененных аниме пользователя</param>
        /// <returns>Массив <see cref="AnimeSeriesFullDto"/>, соответствующих запросу.</returns>
        public async Task<AnimeSeriesFullDto[]> GetAnimeListByIds(string userName, string Ids)
        {
            // 1. Получаем пользователя по никнейму
            var user = await _userRepository.GetUserByUserName(userName);

            var a = GraphQLQueries.GetRecentAnimes(Ids);
            var result = await GetAndMapAnimeData(
                userId: user != null ? user.Id : Guid.Empty,
                request: GraphQLQueries.GetRecentAnimes(Ids),
                mapFunc: _mapper.MapToFullSeriesDto);

            // 2. Сортируем по убыванию даты изменения
            return [.. result.OrderByDescending(m => m.ChangedDate)]; // Преобразуем в массив
        }

        /// <summary>
        /// Получает список по входным параметрам
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="page">Текущая страница.</param>
        /// <param name="name">Название аниме.</param>
        /// <param name="season">Сезон выхода.</param>
        /// <param name="status">Статус выхода.</param>
        /// <param name="kind">Тип аниме.</param>
        /// <param name="genre">Жанры аниме.</param>
        /// <param name="order">Порядок сортировки.</param>
        /// <param name="censored">Безопасный поиск.</param>
        /// <returns>Массив <see cref="AnimeSeriesDto"/>, соответствующих запросу.</returns>
        public async Task<AnimeSeriesDto[]> GetAnimesByAllParams(Guid userId, int page, string name, string season,
            string status, string kind, string genre, string order, bool censored)
        {
            var result = await GetAndMapAnimeData(
               userId: userId,
                request: GraphQLQueries.GetAnimes(page, name, season, status, kind, genre, order, censored),
                mapFunc: _mapper.MapToShortSeriesDto);

            return result.ToArray(); // Преобразуем в массив
        }

        /// <summary>
        /// Получает список аниме по названию
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="animeName">Имя аниме для поиска.</param>
        /// <returns>Массив <see cref="AnimeSeriesDto"/>, соответствующих запросу.</returns>
        public async Task<AnimeSeriesDto[]> GetAnimesByName(Guid userId, string animeName)
        {
            var result = await GetAndMapAnimeData(
                userId: userId,
                request: GraphQLQueries.GetAnimesByName(animeName),
                mapFunc: _mapper.MapToShortSeriesDto);

            return result.ToArray(); // Преобразуем в массив
        }

        /// <summary>
        /// Получает список всех жанров аниме
        /// </summary>
        /// <returns>Объект <see cref="GenreList"/>, содержащий массив объектов <see cref="Genre"/>.</returns>
        public async Task<GenreList> GetGenres()
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<GenreList>(GraphQLQueries.GetGenres(), _logger);
        }

        /// <summary>
        /// Получает случайное аниме
        /// </summary>
        /// <returns>Объект <see cref="ShikimoriAnimeBaseList"/>, содержащий массив объектов <see cref="ShikimoriAnimeBase"/>.</returns>
        public async Task<ShikimoriAnimeBaseList> GetRandomAnime()
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetRandomAnime(), _logger);
        }

        /// <summary>
        /// Получает и маппит данные об аниме, используя предоставленные функции для получения данных и маппинга.
        /// </summary>
        /// <typeparam name="TResult">Тип результата маппинга.</typeparam>
        /// <param name="request">Запрос на получение аниме из набора GraphQLQueries (GraphQL).</param>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="mapFunc">Функция для маппинга данных об аниме в целевой тип TResult.  Принимает данные об аниме (ShikimoriAnimeBase) и опциональные данные о пользовательской категории (SeriesCategoryDto?), возвращает результат маппинга (TResult).</param>
        /// <returns>Коллекция смаппленных данных об аниме типа TResult.</returns>
        private async Task<IEnumerable<TResult>> GetAndMapAnimeData<TResult>(
            Guid userId,
            GraphQL.GraphQLRequest request,
            Func<ShikimoriAnimeBase, SeriesCategoryDto?, TResult> mapFunc)
        {
            // 1. Получаем список аниме через GraphQL
            var animeResponse = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(request, _logger);

            // 2. Формируем список ID аниме
            List<int> animeIds = animeResponse.Animes.Select(s => s.Id).ToList();

            // 3. Получаем пользовательские записи, которые совпадают с animeIds
            var seriesCategoriesDictionary = await _categorySeriesRepository.GetSeriesAnimeId(userId, animeIds);

            // 4. Маппим данные, используя предоставленную функцию маппинга
            var mappedAnimes = animeResponse.Animes
                .Select(item =>
                {
                    // Пытаемся получить SeriesCategoryDTO из словаря
                    seriesCategoriesDictionary.TryGetValue(item.Id, out var categorySeries);

                    // Передаем SeriesCategoryDTO (или null, если не найдено) в функцию маппинга
                    return mapFunc(item, categorySeries);
                });

            // 5. Возвращаем результат
            return mappedAnimes;
        }
    }
}