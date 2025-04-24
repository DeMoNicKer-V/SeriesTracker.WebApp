using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    public class AnimeSeriesFullDto : ShikimoriAnimeBaseFull
    {
        public Guid? SeriesId { get; set; } = null;
        public int? CategoryId { get; set; } = null;
        public string? CategoryName { get; set; } = null;
        public string? CategoryColor { get; set; } = null;
        public int? WatchedEpisodes { get; set; } = null;
        public string? AddedDate { get; set; } = null;
        public string? ChangedDate { get; set; } = null;
        public bool? IsFavorite { get; set; } = null;
    }
}