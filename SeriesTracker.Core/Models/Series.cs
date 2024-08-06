namespace SeriesTracker.Core.Models
{
    public class Series
    {
        private Series(Guid id, int animeId, int watched, string added, string changed, int categoryId, bool favorite)
        {
            Id = id;
            AnimeId = animeId;
            WatchedEpisode = watched;
            AddedDate = added;
            ChangedDate = changed;
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

        public int CategoryId
        {
            get;
        }

        public bool IsFavorite
        {
            get;
        }

        public static (Series Series, string Error) Create(Guid id, int animeId, int watched, string added, string changed, int categoryId, bool favorite)
        {
            string error = string.Empty;
            if (watched < 0)
            {
                error = "Кол-во просмотренных эпизодов не может быть меньше нуля.";
            }
            Series series = new Series(id, animeId, watched, added, changed, categoryId, favorite);

            return (series, error);
        }
    }

}