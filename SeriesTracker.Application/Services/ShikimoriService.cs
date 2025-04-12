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
    /// Предоставляет методы для получения и обработки данных об аниме.
    /// Реализует интерфейс <see cref="IShikimoriService"/>
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

        public async Task<AnimeSeriesFullDto> GetAnimeById(Guid userId, string animeId)
        {
            var result = await GetAndMapAnimeData(
                userId: userId,
                request: GraphQLQueries.GetAnimeById(animeId),
                mapFunc: _mapper.MapToFullSeriesDto);

            return result.Single(); // Используем Single() для получения одного элемента
        }

        public async Task<AnimeSeriesDto[]> GetAnimesByAllParams(Guid userId, int page, string name, string season,
            string status, string kind, string genre, string order, bool censored)
        {
            var result = await GetAndMapAnimeData(
                userId: userId,
                request: GraphQLQueries.GetAnimes(page, name, season, status, kind, genre, order, censored),
                mapFunc: _mapper.MapToShortSeriesDto);

            return result.ToArray(); // Преобразуем в массив
        }

        public async Task<AnimeSeriesDto[]> GetAnimesByName(Guid userId, string animeName)
        {
            var result = await GetAndMapAnimeData(
                userId: userId,
                request: GraphQLQueries.GetAnimesByName(animeName),
                mapFunc: _mapper.MapToShortSeriesDto);

            return result.ToArray(); // Преобразуем в массив
        }

        public async Task<GenreList> GetGenres()
        {
            return await GraphQLHelper.ExecuteGraphQLRequest<GenreList>(GraphQLQueries.GetGenres(), _logger);
        }

        public async Task<GenreGroupingDTO> GetGroupingGenres()
        {
            // 1. Получаем список жанров через GraphQL
            var genreResponse = await GraphQLHelper.ExecuteGraphQLRequest<GenreList>(GraphQLQueries.GetGenres(), _logger);

            // 2. Группируем жанры.  Учитываем, что Kind может быть null
            var groupedRecords = genreResponse.Genres
                .GroupBy(r => r.Kind)
                .ToDictionary(g => g.Key, g => g.ToList());

            // 3. Создание объекта для хранения результатов
            var result = new GenreGroupingDTO
            {
                Theme = groupedRecords.GetValueOrDefault("theme") ?? [], // Используем GetValueOrDefault и обеспечиваем, что не будет ошибки, если группы "theme" нет
                Genre = groupedRecords.GetValueOrDefault("genre") ?? [], // анологично, но с "genre"
                Demographic = groupedRecords.GetValueOrDefault("demographic") ?? []  // анологично, но с "demographic"
            };

            return result;
        }

        public async Task<ShikimoriAnimeBase> GetRandomAnime()
        {
            // 1. Получаем список аниме через GraphQL (предполагаем, что только 1 элемент)
            var animeResponse = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetRandomAnime(), _logger);

            // 2. Возвращаем единственный элемент, или выбрасываем InvalidOperationException
            return animeResponse.Animes.Single();
        }

        public async Task<AnimeSeriesFullDto[]> GetRecentAnimesByIds(string userName, string Ids)
        {
            // 1. Получаем пользователя по никнейму
            var user = await _userRepository.GetUserByUserName(userName);

            var result = await GetAndMapAnimeData(
                userId: user != null ? user.Id : Guid.Empty,
                request: GraphQLQueries.GetAnimesByIds(Ids),
                mapFunc: _mapper.MapToFullSeriesDto);

            // 2. Сортируем по убыванию даты изменения
            return [.. result.OrderByDescending(m => m.ChangedDate)]; // Преобразуем в массив
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