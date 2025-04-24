using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos
{
    public class AnimeSeriesDto : ShikimoriAnimeBase
    {
        public int? CategoryId { get; set; } = 0;
        public string? CategoryName { get; set; } = string.Empty;
        public string? CategoryColor { get; set; } = string.Empty;
    }
}