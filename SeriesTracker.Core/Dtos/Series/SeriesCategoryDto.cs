namespace SeriesTracker.Core.Dtos.Series
{
    public class SeriesCategoryDto
    {
        public Guid Id
        {
            get; set;
        }

        public int CategoryId
        {
            get; set;
        }

        public string CategoryName
        {
            get; set;
        }

        public string CategoryColor
        {
            get; set;
        }

        public bool IsFavorite
        {
            get; set;
        }
    }
}
