using System.Text.Json.Serialization;

namespace SeriesTracker.Core.Dtos.Series
{
    public class SeriesCategoryDto
    {
        public Guid SeriesId
        {
            get; set;
        }

        [JsonIgnore]
        public int AnimeId
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

        public int WatchedEpisodes
        {
            get; set;
        }

        public string AddedDate
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