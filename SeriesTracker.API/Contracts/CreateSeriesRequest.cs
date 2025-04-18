using System.ComponentModel.DataAnnotations;

namespace SeriesTracker.API.Contracts
{
    /// <summary>
    ///  Запрос для создания записи о просмотре аниме пользователем.
    /// </summary>
    /// <param name="AnimeId">Идентификатор аниме (обязательное поле).</param>
    /// <param name="CategoryId">Идентификатор категории, к которой относится аниме (обязательное поле).</param>
    /// <param name="WatchedEpisode">Количество просмотренных эпизодов (обязательное поле).</param>
    /// <param name="IsFavorite">Признак, является ли аниме избранным (обязательное поле).</param>
    public record CreateSeriesRequest
    (
        [Required(ErrorMessage = "AnimeId is required.")] int AnimeId,
        [Required(ErrorMessage = "CategoryId is required.")] int CategoryId,
        [Required(ErrorMessage = "WatchedEpisode is required.")] int WatchedEpisode,
        [Required(ErrorMessage = "IsFavorite is required.")] bool IsFavorite
    );
}