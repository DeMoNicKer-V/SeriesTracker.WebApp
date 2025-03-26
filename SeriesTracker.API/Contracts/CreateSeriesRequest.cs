using System.ComponentModel.DataAnnotations;

namespace SeriesTracker.API.Contracts
{
    public record CreateSeriesRequest
    (
       [Required] int AnimeId,
       [Required] int CategoryId,
       [Required] int WatchedEpisode,
       [Required] bool IsFavorite
    );
}