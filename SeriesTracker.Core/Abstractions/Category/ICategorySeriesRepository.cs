using SeriesTracker.Core.Dtos.Series;

namespace SeriesTracker.Core.Abstractions
{
    /// <summary>
    /// Интерфейс для репозитория, предоставляющего доступ к данным о категориях и пользовательских списках аниме.
    /// </summary>
    public interface ICategorySeriesRepository
    {
        Task<Dictionary<int, SeriesCategoryDto>> GetSeriesAnimeId(Guid userId, List<int> animeIds);
    }
}