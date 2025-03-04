namespace SeriesTracker.Core.Dtos.Series
{
    public class SeriesCategoryDto
    {
        public Guid SeriesId
        {
            get; set;
        }
        public int CategoryId
        {
            get; set;
        }

        public required string CategoryName
        {
            get; set;
        }

        public required string CategoryColor
        {
            get; set;
        }

        public int WatchedEpisodes
        {
            get; set;
        }

        public required string AddedDate
        {
            get; set;
        }

        public string? ChangedDate
        {
            get; set;
        }

        public bool IsFavorite
        {
            get; set;
        }
    }
}
