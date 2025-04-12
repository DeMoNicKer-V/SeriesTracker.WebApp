using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;

namespace SeriesTracker.Application.Services
{
    /// <summary>
    /// Сервис для управления разрешениями пользователей.
    /// Предоставляет методы для получения списка разрешений пользователя.
    /// </summary>
    public class PermissionService : IPermissionSevice
    {
        private readonly IUserRepository _usersRepository;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="PermissionService"/>.
        /// </summary>
        /// <param name="usersRepository">Репозиторий для доступа к данным пользователей.</param>
        public PermissionService(IUserRepository usersRepository)
        {
            _usersRepository = usersRepository;
        }

        public Task<HashSet<Permission>> GetPermissionsAsync(Guid userId)
        {
            return _usersRepository.GetUserPermissions(userId);
        }
    }
}