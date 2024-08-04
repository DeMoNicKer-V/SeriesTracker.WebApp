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

        public int WatchedEpisode
        {
            get; set;
        } = 0;

        public string AddedDate
        {
            get; set;
        } = string.Empty;

        public string ChangedDate
        {
            get; set;
        } = string.Empty;

        public Guid CategoryId
        {
            get; set;
        } = Guid.Empty;

        public bool IsFavorite
        {
            get; set;
        } = false;
    }
}
