using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Abstractions
{
    public interface IShikimoriService
    {
        /// <summary>
        /// Получает список аниме по Id.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="animeId">Id аниме для поиска.</param>
        /// <returns>Массив <see cref="AnimeSeriesFullDto"/>, соответствующих запросу.</returns>
        Task<AnimeSeriesFullDto> GetAnimeById(Guid userId, string animeId);

        /// <summary>
        /// Получает список по входным параметрам.
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
        Task<AnimeSeriesDto[]> GetAnimesByAllParams(Guid userId, int page, string name, string season, string status, string kind, string genre, string order, bool censored);

        /// <summary>
        /// Получает список аниме по названию.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="animeName">Имя аниме для поиска.</param>
        /// <returns>Массив <see cref="AnimeSeriesDto"/>, соответствующих запросу.</returns>
        Task<AnimeSeriesDto[]> GetAnimesByName(Guid userId, string animeName);

        /// <summary>
        /// Получает список всех жанров аниме.
        /// </summary>
        /// <returns>Объект <see cref="GenreList"/>, содержащий массив объектов <see cref="Genre"/>.</returns>
        Task<GenreList> GetGenres();

        /// <summary>
        /// Получает список всех жанров аниме.
        /// </summary>
        /// <returns>Объект <see cref="GenreGroupingDTO"/>, содержащий массив объектов <see cref="Genre"/>, сгруппированых по категориям.</returns>
        Task<GenreGroupingDTO> GetGroupingGenres();

        /// <summary>
        /// Получает случайное аниме.
        /// </summary>
        /// <returns>Объект <see cref="ShikimoriAnime"/>.</returns>
        /// <exception cref="InvalidOperationException"/>
        Task<ShikimoriAnime> GetRandomAnime();

        /// <summary>
        /// Получает список аниме конкретного пользователя в порядке изменения.
        /// </summary>
        /// <param name="userName">Никнейм пользователя.</param>
        /// <param name="Ids">Список id последних измененных аниме пользователя</param>
        /// <returns>Массив <see cref="AnimeSeriesFullDto"/>, соответствующих запросу.</returns>
        Task<AnimeSeriesFullDto[]> GetRecentAnimesByIds(string userName, string Ids);
    }
}