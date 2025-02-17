using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public Guid? SeriesId { get; set; } = Guid.Empty;
        public int? CategoryId { get; set; } = 0;
        public string? CategoryName { get; set; } = string.Empty;
        public string? CategoryColor { get; set; } = string.Empty;
        public int WatchedEpisodes { get; set; } = 0;
        public string? AddedDate { get; set; } = string.Empty;
        public bool IsFavorite { get; set; } = false;
    }
}
