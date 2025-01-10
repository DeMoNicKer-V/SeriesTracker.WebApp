using Microsoft.AspNetCore.Authorization;
using SeriesTracker.Core.Enums;

namespace SeriesTracker.Infrastructure.Authentication
{
    public class PermissionRequirement(Permission[] permissions)
        : IAuthorizationRequirement
    {
        public Permission[] Permissions { get; set; } = permissions;
    }
}
