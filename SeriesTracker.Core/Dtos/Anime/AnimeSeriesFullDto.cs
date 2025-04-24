using SeriesTracker.Core.Interfaces;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    public class AnimeSeriesFullDto : ShikimoriAnimeBaseFull, IAnimeSeries
    {
        public Guid? SeriesId { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryColor { get; set; }
        public int WatchedEpisodes { get; set; }
        public string ChangedDate { get; set; }
        public bool IsFavorite { get; set; }
    }
}