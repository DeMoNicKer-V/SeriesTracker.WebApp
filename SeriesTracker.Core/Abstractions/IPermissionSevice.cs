using SeriesTracker.Core.Enums;

namespace SeriesTracker.Core.Abstractions
{
    public interface IPermissionSevice
    {
        /// <summary>
        /// Получает набор разрешений пользователя по его ID.
        /// </summary>
        /// <param name="userId">ID пользователя.</param>
        /// <returns>Асинхронная задача, представляющая набор разрешений пользователя.</returns>
        Task<HashSet<Permission>> GetPermissionsAsync(Guid userId);
    }
}
