namespace SeriesTracker.Core.Models
{
    public class Series
    {
        private Series(Guid id, int animeId, int watched, string added, string changed, Guid categoryId, bool favorite)
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
        } = 0;

        public int WatchedEpisode
        {
            get;
        } = 0;

        public string AddedDate
        {
            get;
        } = string.Empty;

        public string ChangedDate
        {
            get;
        } = string.Empty;

        public Guid CategoryId
        {
            get;
        }

        public bool IsFavorite
        {
            get;
        } = false;

        public static (Series Series, string Error) Create(Guid id, int animeId, int watched, string added, string changed, Guid categoryId, bool favorite)
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