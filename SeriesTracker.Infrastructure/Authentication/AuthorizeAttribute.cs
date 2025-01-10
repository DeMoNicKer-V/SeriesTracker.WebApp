using Microsoft.AspNetCore.Authorization;
using SeriesTracker.Core.Enums;

namespace SeriesTracker.Infrastructure.Authentication
{
    public class RequirePermissionAttribute : AuthorizeAttribute
    {
        public RequirePermissionAttribute(params Permission[] permissions)
        {
            Policy = string.Join(",", permissions);
        }
    }
}