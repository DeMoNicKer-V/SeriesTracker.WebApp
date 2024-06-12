using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.API.Contracts
{
    public record ShikimoriResponse( int Id, 
     string Description, 
     string Genres, 
     double Duration, 
     int Episodes, 
     double Score, 
     string StartDate, 
     string Title, 
     string SubTitle, 
     string PictureUrl,
     string Rating,
     string Kind, 
     string Status );

    public record ShikimoriResponseIdInfo(ShikimoriAnime Anime, bool isSeries);
}
