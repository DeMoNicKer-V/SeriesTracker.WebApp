using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using SeriesTracker.Core.Abstractions;

namespace SeriesTracker.Infrastructure.Authentication
{
    /// <summary>
    /// AuthorizationHandler, который проверяет наличие у пользователя необходимых разрешений (Permissions).
    /// </summary>
    public class PermissionAuthorizationHandler(IServiceScopeFactory scopeFactory) : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

        /// <summary>
        /// Обрабатывает требование (Requirement) авторизации.
        /// </summary>
        /// <param name="context">Контекст авторизации.</param>
        /// <param name="requirement">Требование авторизации (PermissionRequirement).</param>
        /// <returns>Task, представляющий асинхронную операцию.</returns>
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            // 1. Получение ID пользователя из Claims.
            var userId = context.User.Claims.FirstOrDefault(u => u.Type == "userId");

            // 2. Проверка наличия ID пользователя и его валидности.
            if (userId is null || !Guid.TryParse(userId.Value, out var id))
            {
                return; // Выход из метода, авторизация не пройдена.
            }

            // 3. Создание Scope для получения сервисов.
            using var scope = _scopeFactory.CreateScope();

            // 4. Получение сервиса для работы с разрешениями.
            var permissionSevice = scope.ServiceProvider.GetRequiredService<IPermissionSevice>();

            // 5. Получение списка разрешений для пользователя.
            var permissions = await permissionSevice.GetPermissionsAsync(id);

            // 6. Проверка наличия необходимых разрешений.
            //    Проверяем, содержит ли список разрешений пользователя хотя бы одно разрешение,
            //    которое требуется в PermissionRequirement.
            if (permissions.Intersect(requirement.Permissions).Any())
            {
                // 7. Авторизация пройдена.
                context.Succeed(requirement);
            }
            // 8. Если не прошли проверку, то ничего не делаем.
            //    Т.к. по умолчанию, если ни один AuthorizationHandler не вызвал `context.Succeed`,
            //    то авторизация считается проваленной.
        }
    }
}