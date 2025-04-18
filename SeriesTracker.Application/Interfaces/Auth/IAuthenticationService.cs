namespace SeriesTracker.Application.Services
{
    /// <summary>
    /// Интерфейс для сервиса аутентификации, определяющий методы для выполнения операций аутентификации, таких как проверка учетных данных, регистрация и т. д.
    /// </summary>
    public interface IAuthenticationService
    {
        /// <summary>
        /// Проверяет, существует ли указанный email в системе.
        /// </summary>
        /// <param name="email">Email для проверки.</param>
        /// <returns>Возвращает  `true`, если email существует, иначе -  `false`.</returns>
        Task<bool> EmailExists(string email);

        /// <summary>
        /// Аутентифицирует пользователя и возвращает JWT-токен.
        /// </summary>
        /// <param name="email">Email пользователя.</param>
        /// <param name="password">Пароль пользователя.</param>
        /// <returns>Возвращает JWT-токен в случае успешной аутентификации, иначе - пустую строку.</returns>
        Task<string> Login(string email, string password);

        /// <summary>
        /// Регистрирует нового пользователя в системе.
        /// </summary>
        /// <param name="email">Email пользователя.</param>
        /// <param name="password">Пароль пользователя.</param>
        /// <param name="userName">Имя пользователя (никнейм).</param>
        /// <param name="avatar">URL аватара пользователя (может быть null).</param>
        /// <param name="name">Имя пользователя (может быть null).</param>
        /// <param name="surName">Фамилия пользователя (может быть null).</param>
        /// <param name="dateBirth">Дата рождения пользователя (может быть null).</param>
        /// <returns>Результат асинхронной операции.</returns>
        Task Register(string email, string password, string userName, string? avatar, string? name, string? surName, string? dateBirth);

        /// <summary>
        /// Проверяет, существует ли указанное имя пользователя (userName) в системе.
        /// </summary>
        /// <param name="email">Имя пользователя (userName) для проверки.</param>
        /// <returns>Возвращает  `true`, если имя пользователя существует, иначе -  `false`.</returns>
        Task<bool> UserNameExists(string email);

        /// <summary>
        /// Проверяет, соответствуют ли предоставленные email и пароль учетной записи пользователя.
        /// </summary>
        /// <param name="email">Email пользователя.</param>
        /// <param name="password">Пароль пользователя.</param>
        /// <returns>Возвращает  `true`, если email и пароль верны, иначе -  `false`.</returns>
        Task<bool> Verify(string email, string password);
    }
}