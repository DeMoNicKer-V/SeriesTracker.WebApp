namespace SeriesTracker.Core.Dtos.Anime
{
    public record AnimeShortDto
   (
       int Id,
       string? Description,
       double Duration,
       int Episodes,
       double Score,
        string StartDate,
        string Title,
        string SubTitle,
       string? PictureUrl,
        string Kind,
        string Status,
       string? Rating
   );
}