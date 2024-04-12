namespace SeriesTracker.Core.Models
{
    public class Series
    {
        public Guid ID
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

        public int Duration
        {
            get;
        }

        public string Description
        {
            get;
        } = string.Empty;

        public float Rating
        {
            get;
        }

        public int WatchedEpisode
        {
            get; 
        }

        public string ImagePath
        {
            get;
        } = string.Empty;

        public int LastEpisode
        {
            get;
        }

        public DateTime ReleaseDate
        {
            get;
        }

        public string AddedDate
        {
            get;
        } = string.Empty;

        public string OverDate
        {
            get;
        } = string.Empty;

        public string ChangedDate
        {
            get;
        } = string.Empty;

        public bool IsOver
        {
            get;
        }

        public bool IsFavorite
        {
            get;
        }
    }
}
