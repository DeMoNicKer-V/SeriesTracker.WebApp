using SeriesTracker.Core.Dtos.Series;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    /// <summary>
    /// Интерфейс для репозитория, предоставляющего доступ к данным о пользовательских списках аниме.
    /// </summary>
    public interface IUserSeriesRepository
    {
        /// <summary>
        /// Добавляет новую запись о просмотре аниме в список пользователя.
        /// </summary>
        /// <param name="model">Модель, содержащая информацию о записи.</param>
        /// <returns>Идентификатор созданной записи.</returns>
        Task<Guid> Add(UserSeries model);

        /// <summary>
        /// Удаляет все записи о просмотре аниме для указанного пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя, для которого необходимо удалить все записи.</param>
        /// <returns>Количество удаленных записей.</returns>
        Task<int> DeleteAllSeriesByUserId(Guid userId);

        /// <summary>
        /// Удаляет запись о просмотре аниме из списка пользователя по ее идентификатору.
        /// </summary>
        /// <param name="seriesId">Идентификатор записи, которую необходимо удалить.</param>
        Task DeleteSeriesById(Guid seriesId);

        /// <summary>
        /// Получает список идентификаторов аниме пользователя с учетом параметров фильтрации и пагинации.
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <param name="page">Номер страницы списка.</param>
        /// <param name="categoryId">Идентификатор категории (0 для всех категорий).</param>
        /// <param name="isFavorite">Признак избранного (true для избранных, false для всех).</param>
        /// <returns>Список идентификаторов аниме.</returns>
        Task<List<int>> GetAnimeIdsList(string userName, int page, int categoryId, bool isFavorite);

        /// <summary>
        /// Получает сгруппированный список аниме пользователя по категориям (краткое представление).
        /// </summary>
        /// <param name="userName">Имя пользователя.</param>
        /// <returns>Список, сгруппированых по категорям, <see cref="SeriesGroupShortDto"/></returns>
        Task<List<SeriesGroupShortDto>> GetGroupShortSeries(string userName);

        /// <summary>
        /// Получает профиль пользователя с информацией о его списках аниме.
        /// </summary>
        /// <param name="Id">Идентификатор пользователя.</param>
        /// <returns>DTO, содержащий информацию о профиле пользователя.</returns>
        Task<SeriesProfileDTO> GetUserProfile(Guid Id);

        /// <summary>
        /// Обновляет информацию о просмотре аниме в списке пользователя.
        /// </summary>
        /// <param name="seriesId">Идентификатор записи о просмотре.</param>
        /// <param name="watched">Количество просмотренных эпизодов.</param>
        /// <param name="categoryId">Идентификатор категории.</param>
        /// <param name="favorite">Признак избранного.</param>
        /// <param name="dateNow">Дата и время изменения записи.</param>
        /// <returns>Идентификатор обновленной записи.</returns>
        Task<Guid> UpdateSeries(Guid seriesId, int watched, int categoryId, bool favorite, string dateNow);
    }
}