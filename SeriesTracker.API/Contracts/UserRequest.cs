namespace SeriesTracker.API.Contracts
{
    /// <summary>
    ///  Запрос для регистрации нового пользователя.
    /// </summary>
    /// <param name="Email">Адрес электронной почты пользователя.</param>
    /// <param name="Password">Пароль пользователя.</param>
    /// <param name="UserName">Имя пользователя (никнейм).</param>
    /// <param name="Avatar">URL аватара пользователя (может быть null).</param>
    /// <param name="Name">Имя пользователя (может быть null).</param>
    /// <param name="SurName">Фамилия пользователя (может быть null).</param>
    /// <param name="DateBirth">Дата рождения пользователя (может быть null).</param>
    public record UserRequest
    (
        string? Email,
        string? Password,
        string? UserName,
        string? Avatar,
        string? Name,
        string? SurName,
        string? DateBirth
    );
}