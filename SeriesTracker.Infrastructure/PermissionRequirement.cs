using Microsoft.AspNetCore.Authorization;
using SeriesTracker.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Infrastructure
{
    public class PermissionRequirement(Permission[] permissions) 
        : IAuthorizationRequirement
    {
        public Permission[] Permissions { get; set; } = permissions;
    }
}
