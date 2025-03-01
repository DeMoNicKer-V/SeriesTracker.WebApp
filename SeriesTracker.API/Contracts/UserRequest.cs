using System.ComponentModel.DataAnnotations;

namespace SeriesTracker.API.Contracts
{
    public record UserRequest
      (
        //  [Required(ErrorMessage = "Email обязателен")]
        //  [EmailAddress(ErrorMessage = "Неверный формат email")]
          string Email,

       //   [Required(ErrorMessage = "Пароль обязателен")]
          string Password,

       //   [Required(ErrorMessage = "Никнейм обязателен")]
          string UserName,

          string? Avatar,
          string? Name,
          string? SurName,
          string? DateBirth
      );
}