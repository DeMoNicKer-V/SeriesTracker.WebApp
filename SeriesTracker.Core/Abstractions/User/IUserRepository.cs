using SeriesTracker.Core.Dtos.UserDtos;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    /// <summary>
    /// Интерфейс для репозитория, предоставляющего доступ к данным о пользователях.
    /// </summary>
    public interface IUserRepository
    {
        /// <summary>
        /// Изменяет роль пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="roleId">Идентификатор новой роли.</param>
        /// <returns><see langword="true"/>, если роль успешно изменена, иначе <see langword="false"/>.</returns>
        Task<bool> ChangeUserRole(Guid id, int roleId);

        /// <summary>
        /// Создает нового пользователя.
        /// </summary>
        /// <param name="user">Объект пользователя для создания.</param>
        /// <returns>Идентификатор созданного пользователя (<see cref="Guid"/>).</returns>
        Task<Guid> CreateUser(User user);

        /// <summary>
        /// Удаляет пользователя по идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор пользователя для удаления.</param>
        /// <returns><see langword="true"/>, если пользователь удален, иначе <see langword="false"/>.</returns>
        Task<bool> DeleteUser(Guid id);

        /// <summary>
        /// Получает пользователя по email.
        /// </summary>
        /// <param name="email">Email пользователя.</param>
        /// <returns>Объект пользователя или <see langword="null"/>, если пользователь не найден.</returns>
        Task<User?> GetUserByEmail(string email);

        /// <summary>
        /// Получает пользователя по идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <returns>Объект пользователя или <see langword="null"/>, если пользователь не найден.</returns>
        Task<User?> GetUserById(Guid id);

        /// <summary>
        /// Получает пользователя по никнейму.
        /// </summary>
        /// <param name="userName">Никнейм пользователя.</param>
        /// <returns>Объект пользователя или <see langword="null"/>, если пользователь не найден.</returns>
        Task<User?> GetUserByUserName(string userName);

        /// <summary>
        /// Получает список пользователей с пагинацией.
        /// </summary>
        /// <param name="page">Номер страницы.</param>
        /// <returns>Кортеж, содержащий список пользователей (<see cref="UserDto"/>) и общее количество пользователей (<see cref="int"/>).</returns>
        Task<(List<UserDto>, int)> GetUserList(int page);

        /// <summary>
        /// Получает набор разрешений для указанного пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <returns>
        /// Набор разрешений, которыми обладает пользователь.
        /// Возвращает пустой HashSet, если пользователь не найден или у него нет разрешений.
        /// </returns>
        Task<HashSet<Permission>> GetUserPermissions(Guid userId);

        /// <summary>
        /// Изменяет данные пользователя.
        /// </summary>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <param name="userName">Никнейм пользователя.</param>
        /// <param name="name">Имя пользователя.</param>
        /// <param name="surName">Фамилия пользователя.</param>
        /// <param name="email">Email пользователя.</param>
        /// <param name="passwordHash">Хэш пароля пользователя.</param>
        /// <param name="avatar">Url аватара пользователя.</param>
        /// <param name="dateBirth">Дата рождения пользователя.</param>
        /// <returns><see langword="true"/>, если пользователь изменен, иначе <see langword="false"/>.</returns>
        Task<bool> UpdateUser(Guid id, string userName, string name, string surName, string email, string passwordHash, string avatar, string dateBirth);
    }
}