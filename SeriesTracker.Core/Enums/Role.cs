namespace SeriesTracker.Core.Enums
{
    /// <summary>
    /// Перечисление, представляющее возможные роли пользователей в системе.
    /// </summary>
    public enum Role
    {
        /// <summary>
        /// Роль администратора, обладающая всеми правами.
        /// </summary>
        Admin = 1,

        /// <summary>
        /// Роль модератора, обладающая ограниченными правами.
        /// </summary>
        Moder = 2,

        /// <summary>
        /// Роль обычного пользователя с минимальными правами.
        /// </summary>
        User = 3
    }
}