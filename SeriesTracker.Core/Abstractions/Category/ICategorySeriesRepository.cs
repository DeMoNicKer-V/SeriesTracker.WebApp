using SeriesTracker.Core.Dtos.Series;

namespace SeriesTracker.Core.Abstractions
{
    /// <summary>
    /// Интерфейс для репозитория, предоставляющего доступ к данным о категориях и пользовательских списках аниме.
    /// </summary>
    public interface ICategorySeriesRepository
    {
        /// <summary>
        /// Получает словарь, содержащий информацию о категориях серий пользователя, по списку идентификаторов аниме.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="animeIds">Список идентификаторов аниме.</param>
        /// <returns>Словарь, где ключ - AnimeId, а значение - SeriesCategoryDto.</returns>
        Task<Dictionary<int, SeriesCategoryDto>> GetSeriesAnimeId(Guid userId, List<int> animeIds);
    }
}