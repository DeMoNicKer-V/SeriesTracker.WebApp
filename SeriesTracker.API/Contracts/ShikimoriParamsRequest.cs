namespace SeriesTracker.API.Contracts
{
    /// <summary>
    ///  Параметры для запроса аниме с Shikimori API.
    /// </summary>
    /// <param name="Page">Номер страницы результатов (default = 1).</param>
    /// <param name="Name">Фильтр по названию аниме (необязательный).</param>
    /// <param name="Season">Фильтр по сезону аниме (необязательный).</param>
    /// <param name="Status">Фильтр по статусу аниме (необязательный).</param>
    /// <param name="Kind">Фильтр по типу аниме (необязательный).</param>
    /// <param name="Genre">Фильтр по жанру аниме (необязательный, может быть ID жанра).</param>
    /// <param name="Order">Порядок сортировки результатов (default = "ranked").</param>
    /// <param name="Censored">Включить цензуру или нет (default = false).</param>
    public record ShikimoriParamsRequest
    (
        int Page = 1,
        string Name = "",
        string Season = "",
        string Status = "",
        string Kind = "",
        string Genre = "",
        string Order = "ranked",
        bool Censored = false
    );
}