namespace SeriesTracker.Core.Models
{
    public class Series
    {
        private Series(Guid id, string title, string description, int watched, int last, int duration,
            float rating, string image, string release, string added, string changed, string overDate, bool over, bool favorite)
        {
            Id = id;
            Title = title;
            HiddenTitle = title.ToLower();
            Description = description;
            WatchedEpisode = watched;
            LastEpisode = last;
            Duration = duration;
            Rating = rating;
            ImagePath = image;
            ReleaseDate = release;
            AddedDate = added;
            ChangedDate = changed;
            OverDate = overDate;
            IsOver = over;
            IsFavorite = favorite;
        }

        public Guid Id
        {
            get;
        }

        public string Title
        {
            get;
        } = string.Empty;

        public string HiddenTitle
        {
            get;
        } = string.Empty;


        public string? Description
        {
            get;
        } = string.Empty;

        public float Rating
        {
            get;
        } = 0F;

        public int WatchedEpisode
        {
            get;
        } = 0;

        public int LastEpisode
        {
            get;
        } = 1;

        public int Duration
        {
            get;
        } = 24;

        public string? ImagePath
        {
            get;
        } = string.Empty;

        public string ReleaseDate
        {
            get;
        } = string.Empty;

        public string AddedDate
        {
            get;
        } = string.Empty;

        public string ChangedDate
        {
            get;
        } = string.Empty;

        public string? OverDate
        {
            get;
        } = string.Empty;


        public bool IsOver
        {
            get;
        } = false;

        public bool IsFavorite
        {
            get;
        } = false;

        public static (Series Series, string Error) Create(Guid id, string title, string description, int watched, int last, int duration,
            float rating, string image, string release, string added, string changed, string overDate, bool over, bool favorite)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(title))
            {
                error = "Название это обязательное поле.";
            }
            if (watched < 0)
            {
                error = "Кол-во просмотренных эпизодов не может быть меньше нуля.";
            }
            if (last <= 0 || last < watched)
            {
                error = "Последний эпизод должен быть больше нуля и больше числа просмотренных эпизодов.";
            }
            if (string.IsNullOrEmpty(release))
            {
                error = "Некоректная дата выхода сериала.";
            }
            Series series = new Series(id, title, description, watched, last, duration, rating, image, release, added, changed, overDate, over, favorite);

            return (series, error);
        }
    }

}