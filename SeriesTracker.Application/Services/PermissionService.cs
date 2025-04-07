using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;

namespace SeriesTracker.Application.Services
{
    public class PermissionService : IPermissionSevice
    {
        private readonly IUserRepository _usersRepository;

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
