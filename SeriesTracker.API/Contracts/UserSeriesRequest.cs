namespace SeriesTracker.API.Contracts
{
    /// <summary>
    ///  Запрос для получения информации об списках аниме пользователя.
    /// </summary>
    /// <param name="MyList">Статус просмотра сериала. Default = 0 (все).</param>
    /// <param name="IsFavorite">Является ли сериал избранным.</param>
    public record UserSeriesRequest
    (
        int MyList = 0, // Default = 0
        bool IsFavorite = false
    );
}