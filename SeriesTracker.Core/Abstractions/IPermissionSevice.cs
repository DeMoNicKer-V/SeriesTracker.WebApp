using SeriesTracker.Core.Enums;

namespace SeriesTracker.Core.Abstractions
{
    public interface IPermissionSevice
    {
        Task<HashSet<Permission>> GetPermissionsAsync(Guid userId);
    }
}
