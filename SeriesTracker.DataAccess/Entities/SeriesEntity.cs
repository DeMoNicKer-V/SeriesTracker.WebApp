namespace SeriesTracker.DataAccess.Entities
{
    public class SeriesEntity
    {
        public Guid Id
        {
            get; set;
        }

        public int AnimeId
        {
            get; set;
        } = 0;

        public string Title
        {
            get; set;
        } = string.Empty;

        public string HiddenTitle
        {
            get; set;
        } = string.Empty;


        public string? Description
        {
            get; set;
        } = string.Empty;

        public float Rating
        {
            get; set;
        } = 0F;

        public int WatchedEpisode
        {
            get; set;
        } = 0;

        public int LastEpisode
        {
            get; set;
        } = 1;

        public int Duration
        {
            get; set;
        } = 24;

        public string? ImagePath
        {
            get; set;
        } = string.Empty;

        public string ReleaseDate
        {
            get; set;
        } = string.Empty;

        public string AddedDate
        {
            get; set;
        } = string.Empty;


        public string ChangedDate
        {
            get; set;
        } = string.Empty;

        public string? OverDate
        {
            get; set;
        } = string.Empty;

        public bool IsOver
        {
            get; set;
        } = false;

        public bool IsFavorite
        {
            get; set;
        } = false;
    }
}
