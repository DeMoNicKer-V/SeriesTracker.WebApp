using SeriesTracker.Core.Enums;

namespace SeriesTracker.Core.Abstractions
{
    /// <summary>
    /// Интерфейс для сервиса управления разрешениями пользователей.
    /// Определяет методы для получения списка разрешений пользователя.
    /// </summary>
    public interface IPermissionSevice
    {
        /// <summary>
        /// Получает асинхронно набор разрешений для указанного пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя, для которого необходимо получить разрешения.</param>
        /// <returns>Задача, представляющая асинхронную операцию. Результатом задачи является HashSet разрешений.</returns>
        Task<HashSet<Permission>> GetPermissionsAsync(Guid userId);
    }
}