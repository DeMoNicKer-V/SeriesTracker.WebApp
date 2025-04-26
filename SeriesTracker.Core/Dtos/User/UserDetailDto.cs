namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// DTO, представляющий детальную информацию о пользователе.
    /// Наследуется от <see cref="UserDto"/>, добавляя дополнительные свойства.
    /// </summary>
    public class UserDetailDto : UserDto
    {
        /// <summary>
        /// URL адрес аватара пользователя.
        /// </summary>
        public string? Avatar { get; set; }

        /// <summary>
        /// Дата рождения пользователя.
        /// </summary>
        public string? DateBirth { get; set; }

        /// <summary>
        /// Имя пользователя.
        /// </summary>
        public string? Name { get; set; }

        /// <summary>
        /// Фамилия пользователя.
        /// </summary>
        public string? SurName { get; set; }
    }
}