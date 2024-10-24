using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;

namespace SeriesTracker.API.Contracts
{
    public record ShikimoriResponse(int Id, string Description, int Episodes, string StartDate, double Score, string Title, string SubTitle, string PictureUrl, string Rating, string Kind, string Status );

    public record ShikimoriResponseIdInfo(ShikimoriAnime Anime, bool isSeries);

    public record AnimeSeriesResponse
(
        int Id, int categoryId, string categoryName, string categoryColor, bool isFavorite, string Description, int Episodes, int Duration, string StartDate, double Score, string Title, string SubTitle, string PictureUrl, string Rating, string Kind, string Status
);
    public record AnimeSeriesResponseSearch
(
    int Id, int categoryId, string categoryName, bool isFavorite, string Description, int Episodes, int EpisodesAired, string StartDate, double Score, string Title, string SubTitle, string PictureUrl, string Rating, string Kind, string Status
);
}
