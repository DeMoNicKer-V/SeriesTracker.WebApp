using System.ComponentModel.DataAnnotations;

namespace SeriesTracker.API.Contracts
{
    public record UpdateCategoryColorRequest
    (
       [Required(ErrorMessage = "Color is required.")] string Color
    );
}