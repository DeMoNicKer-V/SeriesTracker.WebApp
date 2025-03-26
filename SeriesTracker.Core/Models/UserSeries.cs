namespace SeriesTracker.Core.Models
{
    public class UserSeries
    {
        public UserSeries(Guid id, int animeId, Guid userId, int categoryId, int watchedEpisodes, string addedDate, string changedDate, bool isFavorite)
        {
            if (animeId <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(animeId), "AnimeId должен быть больше нуля.");
            }

            if (userId == Guid.Empty)
            {
                throw new ArgumentException("UserId не может быть Guid.Empty.", nameof(userId));
            }

            if (categoryId <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(categoryId), "CategoryId должен быть больше нуля.");
            }

            if (watchedEpisodes < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(watchedEpisodes), "Кол-во просмотренных эпизодов не может быть меньше нуля.");
            }

            Id = id;
            AnimeId = animeId;
            UserId = userId;
            CategoryId = categoryId;
            WatchedEpisodes = watchedEpisodes;
            AddedDate = addedDate;
            ChangedDate = changedDate;
            IsFavorite = isFavorite;
        }

        public Guid Id
        {
            get;
        }

        public int AnimeId
        {
            get;
        }

        public Guid UserId
        {
            get;
        }

        public int CategoryId
        {
            get;
        }

        public int WatchedEpisodes
        {
            get;
        }

        public string AddedDate
        {
            get;
        }

        public string ChangedDate
        {
            get;
        }

        public bool IsFavorite
        {
            get;
        }
    }
}