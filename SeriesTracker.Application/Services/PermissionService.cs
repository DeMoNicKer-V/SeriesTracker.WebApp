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
        /// <exception cref="ArgumentNullException">Выбрасывается, если <paramref name="usersRepository"/> равен null.</exception>
        public PermissionService(IUserRepository usersRepository)
        {
            // Внедряем зависимости (Dependency Injection) и проверяем на null
            _usersRepository = usersRepository ?? throw new ArgumentNullException(nameof(usersRepository));
        }

        /// <summary>
        /// Получает асинхронно набор разрешений для указанного пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя, для которого необходимо получить разрешения.</param>
        /// <returns>Задача, представляющая асинхронную операцию. Результатом задачи является HashSet разрешений.</returns>
        public async Task<HashSet<Permission>> GetPermissionsAsync(Guid userId)
        {
            // Получаем разрешения пользователя из репозитория
            return await _usersRepository.GetUserPermissions(userId);
        }
    }
}