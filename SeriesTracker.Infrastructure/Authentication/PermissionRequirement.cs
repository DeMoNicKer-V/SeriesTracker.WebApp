﻿using Microsoft.AspNetCore.Authorization;
using SeriesTracker.Core.Enums;

namespace SeriesTracker.Infrastructure.Authentication
{
    /// <summary>
    /// Представляет требование (Requirement) авторизации, основанное на разрешениях (Permissions).
    /// Используется для определения того, какие разрешения необходимы для доступа к ресурсу.
    /// </summary>
    public class PermissionRequirement(Permission[] permissions)
        : IAuthorizationRequirement
    {
        /// <summary>
        /// Список разрешений, необходимых для удовлетворения требования.
        /// </summary>
        public Permission[] Permissions { get; set; } = permissions;
    }
}