using System.ComponentModel.DataAnnotations;

namespace SeriesTracker.API.Contracts
{
    /// <summary>
    ///  Запрос для входа пользователя в систему.
    /// </summary>
    /// <param name="Email">Адрес электронной почты пользователя (обязательное поле).</param>
    /// <param name="Password">Пароль пользователя (обязательное поле).</param>
    public record LoginUserRequest
    (
        [Required(ErrorMessage = "Email is required.")] string Email,
        [Required(ErrorMessage = "Password is required.")] string Password
    );
}