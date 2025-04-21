namespace SeriesTracker.Core.Models.Shikimori
{
    public partial class ShikimoriAnimeBase
    {
        public string? Description { get; set; }
        public int Duration { get; set; }
        public int Episodes { get; set; }
        public string Genres { get; set; }
        public int Id { get; set; }
        public string Kind { get; set; }
        public string? PictureUrl { get; set; }
        public string Rating { get; set; }
        public double Score { get; set; }
        public string? StartDate { get; set; }
        public string Status { get; set; }
        public string? SubTitle { get; set; }
        public string? Title { get; set; }
        public Screenshot[]? Screenshots { get; set; }
        public IEnumerable<Related>? Relateds { get; set; }
    }
}