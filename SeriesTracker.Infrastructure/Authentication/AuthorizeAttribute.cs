using Microsoft.AspNetCore.Authorization;
using SeriesTracker.Core.Enums;

namespace SeriesTracker.Infrastructure.Authentication
{
    /// <summary>
    /// Атрибут, который требует наличия определенных разрешений для доступа к ресурсу.
    /// Используется для авторизации на основе разрешений (permission-based authorization).
    /// </summary>
    public class RequirePermissionAttribute : AuthorizeAttribute
    {
        /// <summary>
        /// Создает экземпляр атрибута <see cref="RequirePermissionAttribute"/>.
        /// </summary>
        /// <param name="permissions">Список разрешений, необходимых для доступа к ресурсу.
        /// Если указано несколько разрешений, пользователь должен обладать хотя бы одним из них.</param>
        public RequirePermissionAttribute(params Permission[] permissions)
        {
            // Формируем политику авторизации, объединяя разрешения в строку, разделенную запятыми.
            // Эта строка будет использоваться AuthorizationHandler для проверки наличия разрешений у пользователя.
            Policy = string.Join(",", permissions);
        }
    }
}