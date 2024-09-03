using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using SeriesTracker.Core.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Infrastructure
{
    public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public PermissionAuthorizationHandler(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            var userId = context.User.Claims.FirstOrDefault(
           u => u.Type == "userId");

            if (userId is null || !Guid.TryParse(userId.Value, out var id))
                return;

            using var scope = _scopeFactory.CreateScope();

            var permissionSevice = scope.ServiceProvider.GetRequiredService<IPermissionSevice>();

            var permissions = await permissionSevice.GetPermissionsAsync(id);

            if (permissions.Intersect(requirement.Permissions).Any())
            {
                context.Succeed(requirement);
            }
        }
    }
}