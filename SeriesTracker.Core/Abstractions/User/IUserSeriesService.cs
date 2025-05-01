using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Models.Shikimori;
using SeriesTracker.Core.Exceptions;

namespace SeriesTracker.Core.Abstractions
{
    /// <summary>
    /// Интерфейс для сервиса, предоставляющего доступ к пользовательским спискам аниме.
    /// </summary>
    public interface IUserSeriesService
    {
        /// <summary>
        /// Создает новую запись о просмотре аниме в списке пользователя.
        /// </summary>
        /// <param name="seriesId">Уникальный идентификатор записи.</param>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="animeId">Идентификатор аниме.</param>
        /// <param name="categoryId">Идентификатор категории.</param>
        /// <param name="watchedEpisodes">Количество просмотренных эпизодов.</param>
        /// <param name="isFavorite">Признак избранного.</param>
        /// <returns>Guid идентификатор созданной записи.</returns>
        Task<Guid> Create(Guid seriesId, Guid userId, int animeId, int categoryId, int watchedEpisodes, bool isFavorite);

        /// <summary>
        /// Удаляет все записи о просмотре аниме из списка пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <returns><see langword="true"/>, если данные удалены, иначе - <see langword="false"/></returns>
        Task<bool> DeleteAllSeries(Guid userId);

        /// <summary>
        /// Удаляет запись о просмотре аниме из списка пользователя.
        /// </summary>
        /// <param name="seriesId">Идентификатор записи, которую необходимо удалить.</param>
        /// <returns>Task, представляющий асинхронную операцию удаления.</returns>
        /// <returns><see langword="true"/>, если данные удалены, иначе - <see langword="false"/></returns>
        Task<bool> DeleteSeries(Guid seriesId);

        /// <summary>
        /// Получает сгруппированный список аниме пользователя по категориям.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <returns>Список, сгруппированых по категорям, <see cref="SeriesGroupDto"/></returns>
        Task<List<SeriesGroupDto>> GetGroupShortSeries(string userName);

        /// <summary>
        /// Получает профиль пользователя с информацией о его активности.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <returns>DTO с информацией о профиле пользователя или null, если пользователь не найден.</returns>
        Task<UserActivityDTO?> GetUserProfile(string userName);

        /// <summary>
        /// Получает список аниме пользователя с использованием GraphQL API.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <param name="page">Номер страницы списка.</param>
        /// <param name="categoryId">Идентификатор категории.</param>
        /// <param name="isFavorite">Признак избранного.</param>
        /// <returns>Массив базовых DTO с информацией об аниме.</returns>
        /// <exception cref="NotFoundException">Выбрасывается, если пользователя не найдено.</exception>
        Task<ShikimoriAnime[]> GetUserSeriesList(string userName, int page, int categoryId, bool isFavorite);

        /// <summary>
        /// Обновляет информацию о просмотре аниме в списке пользователя.
        /// </summary>
        /// <param name="seriesId">Идентификатор записи о просмотре.</param>
        /// <param name="watched">Количество просмотренных эпизодов.</param>
        /// <param name="categoryId">Идентификатор категории.</param>
        /// <param name="favorite">Признак избранного.</param>
        /// <returns><see langword="true"/>, если данные обновлены, иначе - <see langword="false"/></returns>
        Task<bool> UpdateSeries(Guid seriesId, int watched, int categoryId, bool favorite);
    }
}