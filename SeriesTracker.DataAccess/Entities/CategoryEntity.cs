namespace SeriesTracker.DataAccess.Entities
{
    public class CategoryEntity
    {
        public int Id
        {
            get; set;
        }

        public required string Name
        {
            get; set;
        }

        public required string Color
        {
            get; set;
        }
        public string? PrevColor
        {
            get; set;
        }

        public ICollection<UserSeriesEntity> Series { get; set; } = new List<UserSeriesEntity>();

        public required string Date
        {
            get; set;
        }
    }
}
