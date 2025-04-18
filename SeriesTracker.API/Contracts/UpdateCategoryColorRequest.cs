using System.ComponentModel.DataAnnotations;

namespace SeriesTracker.API.Contracts
{
    /// <summary>
    /// Запрос для обновления цвета категории.
    /// </summary>
    /// <param name="Color">Новый цвет категории. Обязательно, например, #FFFFFF.</param>
    public record UpdateCategoryColorRequest
    (
        [Required(ErrorMessage = "Color is required.")] string Color
    );
}