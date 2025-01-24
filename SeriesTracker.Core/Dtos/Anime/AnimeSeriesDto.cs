
namespace SeriesTracker.Core.Dtos.Anime
{
    public class AnimeSeriesDto
    {   public int Id{get; set;}
        public string? Description{get; set;}
        public double Duration{get; set;}
        public int Episodes{get; set;}
        public double Score{get; set;}
        public string StartDate{get; set;}
        public string Title{get; set;}
        public string SubTitle{get; set;}
        public string? PictureUrl{get; set;}
        public string Kind{get; set;}
        public string Status{get; set;}
        public string? Rating{get; set;}
        public int? CategoryId { get; set; } = 0;
        public string? CategoryName { get; set; } = string.Empty;
        public string? CategoryColor {get; set;} = string.Empty;
        }
    
}
