using SeriesTracker.Core.Dtos;

namespace SeriesTracker.Core.Abstractions
{
    /// <summary>
    /// Интерфейс для сервиса работы с пользователями.
    /// Определяет методы для получения, создания, обновления и удаления пользователей.
    /// </summary>
    public interface IUserService
    {
        /// <summary>
        /// Изменяет роль пользователя.
        /// </summary>
        /// <param name="id">ID пользователя, роль которого необходимо изменить.</param>
        /// <param name="roleId">ID новой роли пользователя.</param>
        /// <returns>Возвращает `true`, если роль пользователя была успешно изменена, иначе - `false`.</returns>
        Task<bool> ChangeUserRole(Guid id, int roleId);

        /// <summary>
        /// Удаляет пользователя по указанному ID.
        /// </summary>
        /// <param name="id">ID пользователя, которого необходимо удалить.</param>
        /// <returns>Возвращает `true`, если пользователь был успешно удален, иначе - `false`.</returns>
        Task<bool> DeleteUser(Guid id);

        /// <summary>
        /// Генерирует новый JWT-токен для указанного пользователя.
        /// </summary>
        /// <param name="userName">Имя пользователя, для которого необходимо сгенерировать токен.</param>
        /// <returns>Новый JWT-токен, если пользователь найден, иначе - пустая строка.</returns>
        Task<string> GenerateNewUserToken(string userName);

        /// <summary>
        /// Получает детальную информацию о пользователе по указанному ID.
        /// </summary>
        /// <param name="id">ID пользователя, информацию о котором необходимо получить.</param>
        /// <returns>Объект <see cref="UserDetailDto"/> с детальной информацией о пользователе, если пользователь найден, иначе - `null`.</returns>
        Task<UserDetailDto?> GetUserById(Guid id);

        /// <summary>
        /// Получает детальную информацию о пользователе по указанному имени пользователя.
        /// </summary>
        /// <param name="userName">Имя пользователя, информацию о котором необходимо получить.</param>
        /// <returns>Объект <see cref="UserDetailDto"/> с детальной информацией о пользователе, если пользователь найден, иначе - `null`.</returns>
        Task<UserDetailDto?> GetUserByUserName(string userName);

        /// <summary>
        /// Получает список пользователей с пагинацией.
        /// </summary>
        /// <param name="page">Номер страницы для получения.</param>
        /// <returns>Кортеж, содержащий список пользователей и общее количество пользователей.</returns>
        Task<(List<UserDto>, int)> GetUserList(int page);

        /// <summary>
        /// Обновляет информацию о пользователе.
        /// </summary>
        /// <param name="id">ID пользователя, которого необходимо обновить.</param>
        /// <param name="userName">Новое имя пользователя (если необходимо обновить).</param>
        /// <param name="name">Новое имя (если необходимо обновить).</param>
        /// <param name="surName">Новая фамилия (если необходимо обновить).</param>
        /// <param name="email">Новый email (если необходимо обновить).</param>
        /// <param name="password">Новый пароль (если необходимо обновить).</param>
        /// <param name="avatar">Новый URL аватара (если необходимо обновить).</param>
        /// <param name="dateBirth">Новая дата рождения (если необходимо обновить).</param>
        /// <returns>Возвращает `true`, если информация о пользователе была успешно обновлена, иначе - `false`.</returns>
        Task<bool> UpdateUser(Guid id, string? userName, string? name, string? surName, string? email, string? password, string? avatar, string? dateBirth);
    }
}