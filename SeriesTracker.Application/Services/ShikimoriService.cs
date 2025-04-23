using AutoMapper;
using Microsoft.Extensions.Logging;
using SeriesTracker.Application.Extensions;
using SeriesTracker.Core;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Anime;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;
using System.Xml.Linq;

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
            var result = await GetAndMapAnimeData<ShikimoriAnimeFullDto,
                ShikimoriAnimeBaseFull, AnimeSeriesFullDto>(userId, GraphQLQueries.GetAnimeById(animeId), _mapper.MapToFullSeriesDto);

            return result.Single();
        }

        public async Task<AnimeSeriesDto[]> GetAnimesByAllParams(Guid userId, int page, string name, string season,
            string status, string kind, string genre, string order, bool censored)
        {
            // Выполняем GraphQL запрос к Api
            var animeResponse = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList<ShikimoriAnimeBase>>(GraphQLQueries.GetAnimes(page, name, season, status, kind, genre, order, censored), _logger);

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
                    return _mapper.MapToShortSeriesDto(item, categorySeries);
                });

            return mappedAnimes.ToArray(); // Преобразуем в массив
        }

        public async Task<AnimeSeriesDto[]> GetAnimesByName(Guid userId, string animeName)
        {
            // Выполняем GraphQL запрос к Api
            var animeResponse = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList<ShikimoriAnimeDto>>(GraphQLQueries.GetAnimesByName(animeName), _logger);

            var animeBaseArray = _mapper.Map<ShikimoriAnimeBase[]>(animeResponse.Animes);

            List<int> animeIds = animeResponse.Animes.Select(s => s.Id).ToList();

            // 3. Получаем пользовательские записи, которые совпадают с animeIds
            var seriesCategoriesDictionary = await _categorySeriesRepository.GetSeriesAnimeId(userId, animeIds);

            // 4. Маппим данные, используя предоставленную функцию маппинга
            var mappedAnimes = animeBaseArray
                .Select(item =>
                {
                    // Пытаемся получить SeriesCategoryDTO из словаря
                    seriesCategoriesDictionary.TryGetValue(item.Id, out var categorySeries);

                    // Передаем SeriesCategoryDTO (или null, если не найдено) в функцию маппинга
                    return _mapper.MapToShortSeriesDto(item, categorySeries);
                });

            return mappedAnimes.ToArray(); // Преобразуем в массив
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
            var animeResponse = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList<ShikimoriAnimeBaseFull>>(GraphQLQueries.GetAnimesByIds(Ids), _logger);

            List<int> animeIds = animeResponse.Animes.Select(s => s.Id).ToList();

            // 3. Получаем пользовательские записи, которые совпадают с animeIds
            var seriesCategoriesDictionary = await _categorySeriesRepository.GetSeriesAnimeId(user.Id, animeIds);

            // 4. Маппим данные, используя предоставленную функцию маппинга
            var mappedAnimes = animeResponse.Animes
                .Select(item =>
                {
                    // Пытаемся получить SeriesCategoryDTO из словаря
                    seriesCategoriesDictionary.TryGetValue(item.Id, out var categorySeries);

                    // Передаем SeriesCategoryDTO (или null, если не найдено) в функцию маппинга
                    return _mapper.MapToFullSeriesDto(item, categorySeries);
                });

            // 2. Сортируем по убыванию даты изменения
            return [.. mappedAnimes.OrderByDescending(m => m.ChangedDate)]; // Преобразуем в массив
        }

        private async Task<IEnumerable<TResult>> GetAndMapAnimeData<TSource, TIntermediate, TResult>(
     Guid userId,
     GraphQL.GraphQLRequest request,
     Func<TIntermediate, SeriesCategoryDto?, TResult> mapFunc)
     where TSource : IAnime
     where TIntermediate : IAnime
        {
            var animeList = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList<TSource>>(request, _logger);
            var animeBaseArray = _mapper.Map<TIntermediate[]>(animeList.Animes);

            // 2. Формируем список ID аниме
            List<int> animeIds = animeBaseArray.Select(s => s.Id).ToList();

            // 3. Получаем пользовательские записи, которые совпадают с animeIds
            var seriesCategoriesDictionary = await _categorySeriesRepository.GetSeriesAnimeId(userId, animeIds);

            // 4. Маппим данные, используя предоставленную функцию маппинга
            var mappedAnimes = animeBaseArray
                .Select(item =>
                {
                    // Пытаемся получить SeriesCategoryDTO из словаря
                    seriesCategoriesDictionary.TryGetValue(item.Id, out var categorySeries);

                    // Передаем SeriesCategoryDTO (или null, если не найдено) в функцию маппинга
                    return mapFunc(item, categorySeries);
                });

            return mappedAnimes;
        }
    }
}