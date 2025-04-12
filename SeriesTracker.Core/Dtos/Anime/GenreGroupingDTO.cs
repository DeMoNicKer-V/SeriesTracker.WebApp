using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.Core.Dtos.Anime
{
    public class GenreGroupingDTO
    {
        public List<Genre> Theme { get; set; }
        public List<Genre> Genre { get; set; }
        public List<Genre> Demographic { get; set; }
    }
}
