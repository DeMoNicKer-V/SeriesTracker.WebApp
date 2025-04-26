namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// DTO (Data Transfer Object), представляющий основные данные пользователя.
    /// </summary>
    public class UserDto
    {
        /// <summary>
        /// Уникальный идентификатор пользователя.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Имя пользователя.
        /// </summary>
        public required string UserName { get; set; }

        /// <summary>
        /// Адрес электронной почты пользователя.
        /// </summary>
        public required string Email { get; set; }

        /// <summary>
        /// Идентификатор роли пользователя.
        /// </summary>
        public int RoleId { get; set; }

        /// <summary>
        /// Дата регистрации пользователя.
        /// </summary>
        public required string RegDate { get; set; }
    }
}