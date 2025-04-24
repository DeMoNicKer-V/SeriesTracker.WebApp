using AutoMapper;
using Microsoft.Extensions.Logging;
using SeriesTracker.Application.Extensions;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Interfaces;
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
        /// <param name="categorySeriesRepository">Репозиторий для работы с категориями и записями пользователя.</param>
        /// <param name="logger">Экземпляр ILogger для логирования.</param>
        /// <param name="mapper">Экземпляр IMapper для маппинга объектов.</param>
        /// <param name="userRepository">Репозиторий для работы с пользователями.</param>
        public ShikimoriService(
            ICategorySeriesRepository categorySeriesRepository,
            ILogger<ShikimoriService> logger,
            IMapper mapper,
            IUserRepository userRepository)
        {
            // Внедряем зависимости (Dependency Injection) и проверяем на null
            _categorySeriesRepository = categorySeriesRepository ?? throw new ArgumentNullException(nameof(categorySeriesRepository));

            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));

            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

        public async Task<AnimeSeriesFullDto> GetAnimeById(Guid userId, string animeId)
        {
            // Выполняем GraphQL запрос к Api
            var result = await GetAndMapAnimeData<ShikimoriAnimeFullDto,
                ShikimoriAnimeBaseFull, AnimeSeriesFullDto>(userId, GraphQLQueries.GetAnimeById(animeId), _mapper.MapToFullSeriesDto);

            return result.Single();
        }

        public async Task<AnimeSeriesDto[]> GetAnimesByAllParams(Guid userId, int page, string name, string season,
            string status, string kind, string genre, string order, bool censored)
        {
            // Выполняем GraphQL запрос к Api
            var result = await GetAndMapAnimeData<ShikimoriAnimeDto,
                ShikimoriAnimeBase, AnimeSeriesDto>(userId, GraphQLQueries.GetAnimes(page, name, season, status, kind, genre, order, censored), _mapper.MapToShortSeriesDto);

            return result;
        }

        public async Task<AnimeSeriesDto[]> GetAnimesByName(Guid userId, string animeName)
        {
            // Выполняем GraphQL запрос к Api
            var result = await GetAndMapAnimeData<ShikimoriAnimeDto,
                ShikimoriAnimeBase, AnimeSeriesDto>(userId, GraphQLQueries.GetAnimesByName(animeName), _mapper.MapToShortSeriesDto);

            return result;
        }

        public async Task<GenreList> GetGenres()
        {
            // Выполняем GraphQL запрос к Api и возвращаем список жанров
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
            var animeResponse = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList<ShikimoriAnimeBase>>(GraphQLQueries.GetRandomAnime(), _logger);

            // 2. Возвращаем единственный элемент, или выбрасываем InvalidOperationException
            return animeResponse.Animes.Single();
        }

        public async Task<AnimeSeriesFullDto[]> GetRecentAnimesByIds(string userName, string Ids)
        {
            // 1. Получаем пользователя по никнейму
            var user = await _userRepository.GetUserByUserName(userName);

            // Выполняем GraphQL запрос к Api
            var result = await GetAndMapAnimeData<ShikimoriAnimeFullDto,
                ShikimoriAnimeBaseFull, AnimeSeriesFullDto>(user == null ? Guid.Empty : user.Id, GraphQLQueries.GetAnimesByIds(Ids), _mapper.MapToFullSeriesDto);

            // 2. Сортируем по убыванию даты изменения
            return [.. result.OrderByDescending(m => m.ChangedDate)]; // Преобразуем обратно в массив
        }

        /// <summary>
        /// Получает данные об аниме из GraphQL API, сопоставляет их с пользовательскими категориями
        /// и преобразует в целевой тип.
        /// </summary>
        /// <typeparam name="TSource">Тип данных, возвращаемый GraphQL API (должен реализовывать IAnime).</typeparam>
        /// <typeparam name="TIntermediate">Тип данных, в который нужно преобразовать данные аниме (должен реализовывать IAnime).</typeparam>
        /// <typeparam name="TResult">Тип данных, в который нужно преобразовать данные аниме после сопоставления с категориями.</typeparam>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="request">GraphQL запрос.</param>
        /// <param name="mapFunc">Функция для сопоставления данных аниме с данными категории и преобразования в тип TResult.</param>
        /// <returns>Массив данных об аниме типа TResult.</returns>
        private async Task<TResult[]> GetAndMapAnimeData<TSource, TIntermediate, TResult>(
            Guid userId,
            GraphQL.GraphQLRequest request,
            Func<TIntermediate, SeriesCategoryDto?, TResult> mapFunc)
            where TSource : IAnime
            where TIntermediate : IAnime
        {
            // 1. Получаем список аниме через GraphQL
            var animeList = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList<TSource>>(request, _logger);

            // 2. Преобразуем данные аниме из типа TSource в тип TIntermediate с использованием AutoMapper
            var animeBaseArray = _mapper.Map<TIntermediate[]>(animeList.Animes);

            // 3. Формируем список ID аниме для запроса категорий
            List<int> animeIds = animeBaseArray.Select(s => s.Id).ToList();

            // 4. Получаем пользовательские записи о категориях аниме, которые совпадают с animeIds
            var seriesCategoriesDictionary = await _categorySeriesRepository.GetSeriesAnimeId(userId, animeIds);

            // 5. Сопоставляем данные аниме с данными категории и преобразуем в тип TResult
            var mappedAnimes = animeBaseArray
                .Select(item =>
                {
                    // 5.1 Пытаемся получить SeriesCategoryDTO из словаря по Id аниме
                    seriesCategoriesDictionary.TryGetValue(item.Id, out var categorySeries);

                    // 5.2 Преобразуем данные аниме и категории в тип TResult, используя предоставленную функцию маппинга
                    return mapFunc(item, categorySeries);
                }).ToArray();

            // 6. Возвращаем массив преобразованных данных
            return mappedAnimes;
        }
    }
}