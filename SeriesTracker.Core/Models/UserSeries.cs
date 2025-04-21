namespace SeriesTracker.Core.Models
{
    /// <summary>
    /// Представляет модель, связывающую пользователя с конкретным аниме и его прогрессом просмотра.
    /// </summary>
    public class UserSeries
    {
        /// <summary>
        /// Конструктор для создания экземпляра класса <see cref="UserSeries"/>.
        /// </summary>
        /// <param name="id">Уникальный идентификатор записи о просмотре сериала пользователем.</param>
        /// <param name="animeId">Идентификатор аниме.</param>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="categoryId">Идентификатор категории, к которой пользователь отнес данный сериал.</param>
        /// <param name="watchedEpisodes">Количество просмотренных эпизодов.</param>
        /// <param name="addedDate">Дата добавления аниме в список пользователя.</param>
        /// <param name="changedDate">Дата последнего изменения данных о просмотре аниме.</param>
        /// <param name="isFavorite">Признак, является ли аниме избранным для пользователя.</param>
        private UserSeries(Guid id, int animeId, Guid userId, int categoryId, int watchedEpisodes, string addedDate, string changedDate, bool isFavorite)
        {
            Id = id;
            AnimeId = animeId;
            UserId = userId;
            CategoryId = categoryId;
            WatchedEpisodes = watchedEpisodes;
            AddedDate = addedDate;
            ChangedDate = changedDate;
            IsFavorite = isFavorite;
        }

        /// <summary>
        /// Уникальный идентификатор записи о просмотре сериала пользователем.
        /// </summary>
        public Guid Id
        {
            get;
        }

        /// <summary>
        /// Идентификатор аниме.
        /// </summary>
        public int AnimeId
        {
            get;
        }

        /// <summary>
        /// Идентификатор пользователя.
        /// </summary>
        public Guid UserId
        {
            get;
        }

        /// <summary>
        /// Идентификатор категории, к которой пользователь отнес данный сериал.
        /// </summary>
        public int CategoryId
        {
            get; private set;
        }

        /// <summary>
        /// Количество просмотренных эпизодов.
        /// </summary>
        public int WatchedEpisodes
        {
            get; private set;
        }

        /// <summary>
        /// Дата добавления аниме в список пользователя.
        /// </summary>
        public string AddedDate
        {
            get;
        }

        /// <summary>
        /// Дата последнего изменения данных о просмотре аниме.
        /// </summary>
        public string ChangedDate
        {
            get; private set;
        }

        /// <summary>
        /// Признак, является ли аниме избранным для пользователя.
        /// </summary>
        public bool IsFavorite
        {
            get; private set;
        }

        /// <summary>
        /// Фабричный метод для создания экземпляра класса <see cref="UserSeries"/>.
        /// </summary>
        /// <param name="id">Уникальный идентификатор записи о просмотре сериала пользователем.</param>
        /// <param name="animeId">Идентификатор аниме.</param>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="categoryId">Идентификатор категории, к которой пользователь отнес данный сериал.</param>
        /// <param name="watchedEpisodes">Количество просмотренных эпизодов.</param>
        /// <param name="addedDate">Дата добавления аниме в список пользователя.</param>
        /// <param name="changedDate">Дата последнего изменения данных о просмотре аниме.</param>
        /// <param name="isFavorite">Признак, является ли аниме избранным для пользователя.</param>
        /// <returns>Новый экземпляр класса <see cref="UserSeries"/>.</returns>
        public static UserSeries Create(Guid id, int animeId, Guid userId, int categoryId, int watchedEpisodes, string addedDate, string changedDate, bool isFavorite)
        {
            UserSeries userSeries = new(id, animeId, userId, categoryId, watchedEpisodes, addedDate, changedDate, isFavorite);

            return userSeries;
        }
    }
}