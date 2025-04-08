using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos.Anime
{
    public class AnimeSeriesFullDto
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string? Genres { get; set; }
        public double Duration { get; set; }
        public int Episodes { get; set; }
        public double Score { get; set; }
        public string StartDate { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string? PictureUrl { get; set; }
        public string Kind { get; set; }
        public string Status { get; set; }
        public string? Rating { get; set; }
        public IEnumerable<Related>? Relateds { get; set; } = [];
        public Screenshot[]? Screenshots { get; set; } = [];
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
