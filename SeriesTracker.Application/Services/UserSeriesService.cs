﻿using AutoMapper;
using Microsoft.Extensions.Logging;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Dtos.User;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Application.Services
{
    /// <summary>
    /// Сервис для управления пользовательскими списками аниме.
    /// Предоставляет методы для создания, обновления, удаления и получения информации о списках аниме пользователей.
    /// </summary>
    public class UserSeriesService : IUserSeriesService
    {
        private readonly ILogger<UserSeriesService> _logger;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IUserSeriesRepository _userSeriesRepository;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="UserSeriesService"/>.
        /// </summary>
        /// <param name="userSeriesRepository">Репозиторий для работы с пользовательскими списками аниме.</param>
        /// <param name="userRepository">Репозиторий для работы с пользователями.</param>
        /// <param name="logger">Логгер для записи информации о работе сервиса.</param>
        /// <param name="mapper">Маппер для преобразования объектов.</param>
        public UserSeriesService(
            IUserSeriesRepository userSeriesRepository, IUserRepository userRepository, ILogger<UserSeriesService> logger, IMapper mapper)
        {
            _userSeriesRepository = userSeriesRepository ?? throw new ArgumentNullException(nameof(userSeriesRepository));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<Guid> Create(Guid seriesId, Guid userId, int animeId, int categoryId, int watchedEpisodes, bool isFavorite)
        {
            var dateNow = DateTime.UtcNow.ToString("s"); // Получаем текущую дату и время в формате "s" (ISO 8601)

            var userSeries = UserSeries.Create
                (
                    seriesId,
                    animeId,
                    userId,
                    categoryId,
                    watchedEpisodes,
                    dateNow,
                    dateNow,
                    isFavorite
                );

            return await _userSeriesRepository.Add(userSeries); // Добавляем запись в репозиторий и возвращаем ее идентификатор
        }

        public async Task<int> DeleteAllSeries(Guid userId)
        {
            return await _userSeriesRepository.DeleteAllSeriesByUserId(userId); // Удаляем записи пользователя и возвращаем их количество
        }

        public async Task DeleteSeries(Guid seriesId)
        {
            await _userSeriesRepository.DeleteSeriesById(seriesId); // Удаляем запись по Id
        }

        public async Task<List<SeriesGroupShortDto>> GetGroupShortSeries(string userName)
        {
            return await _userSeriesRepository.GetGroupShortSeries(userName); // Возвращаем список, сгруппированых по категорям, записей пользователя
        }

        public async Task<UserActivityDTO?> GetUserProfile(string userName)
        {
            var user = await _userRepository.GetUserByUserName(userName); // Получаем информацию о пользователе из репозитория
            if (user == null)
            {
                return null; // Возвращаем null, если пользователь не найден
            }

            var seriesProfile = await _userSeriesRepository.GetUserProfile(user.Id); // Получаем профиль пользователя
            var userActivity = _mapper.Map<UserActivityDTO>(user, opt => // Маппим данные пользователя
            {
                opt.Items["SeriesGroup"] = seriesProfile.CategoryGroups;
                opt.Items["SeriesIDS"] = seriesProfile.LastFiveSeries;
            });
            return userActivity; // Возвращаем DTO с информацией о профиле пользователя
        }

        public async Task<ShikimoriAnimeBase[]> GetUserSeriesList(string userName, int page, int categoryId, bool isFavorite)
        {
            var animeIds = await _userSeriesRepository.GetAnimeIdsList(userName, page, categoryId, isFavorite); // Получаем список идентификаторов аниме из репозитория

            if (animeIds.Count == 0)
            {
                return []; // Возвращаем пустой массив, если список идентификаторов пуст
            }

            var idsString = string.Join(",", animeIds); // Преобразуем список идентификаторов в строку, разделенную запятыми
            var data = await GraphQLHelper.ExecuteGraphQLRequest<ShikimoriAnimeBaseList>(GraphQLQueries.GetAnimesByIds(idsString), _logger); // Выполняем GraphQL-запрос для получения информации об аниме
            return data.Animes; // Возвращаем массив DTO с информацией об аниме
        }

        public async Task<Guid> UpdateSeries(Guid seriesDd, int watched, int categoryId, bool favorite)
        {
            var dateNow = DateTime.UtcNow.ToString("s"); // Получаем текущую дату и время в формате "s" (ISO 8601)
            return await _userSeriesRepository.UpdateSeries(seriesDd, watched, categoryId, favorite, dateNow); // Обновляем запись в репозитории и возвращаем ее идентификатор
        }
    }
}