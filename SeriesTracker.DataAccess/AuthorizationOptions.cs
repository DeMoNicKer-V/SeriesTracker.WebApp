namespace SeriesTracker.DataAccess
{
    /// <summary>
    /// Класс, представляющий опции авторизации приложения.
    /// Содержит информацию о разрешениях, связанных с ролями пользователей.
    /// </summary>
    public class AuthorizationOptions
    {
        /// <summary>
        /// Массив объектов <see cref="RolePermissions"/>, определяющих разрешения для каждой роли.
        /// </summary>
        public RolePermissions[] RolePermissions { get; set; } = [];
    }

    /// <summary>
    /// Класс, представляющий разрешения, связанные с определенной ролью.
    /// </summary>
    public class RolePermissions
    {
        /// <summary>
        /// Название роли.
        /// </summary>
        public string Role { get; set; } = string.Empty;

        /// <summary>
        /// Массив разрешений, связанных с ролью.
        /// </summary>
        public string[] Permissions { get; set; } = [];
    }
}