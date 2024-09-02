using System.ComponentModel.DataAnnotations;

namespace SeriesTracker.API.Contracts
{
    public record LoginUserRequest
    (
        [Required] string Email,
           [Required] string Password
    );
}
