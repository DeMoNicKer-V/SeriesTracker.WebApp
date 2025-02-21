namespace SeriesTracker.Core.Models
{
    public class UserSeries
    {
        private UserSeries(Guid id, int animeId, Guid userId, int categoryId, int watched, string addedDate, string changedDate, bool favorite)
        {
            Id = id;
            AnimeId = animeId;
            UserId = userId;
            WatchedEpisode = watched;
            AddedDate = addedDate;
            ChangedDate = changedDate;
            CategoryId = categoryId;
            IsFavorite = favorite;
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

        public int WatchedEpisode
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

        public static (UserSeries UserSeries, string Error) Create(Guid id, int animeId, Guid userId, int categoryId, int watched, string addedDate, string changedDate, bool favorite)
        {
            string error = string.Empty;
            if (watched < 0)
            {
                error = "Кол-во просмотренных эпизодов не может быть меньше нуля.";
            }
            UserSeries userSeries = new(id, animeId, userId, categoryId, watched, addedDate, changedDate, favorite);

            return (userSeries, error);
        }
    }
}