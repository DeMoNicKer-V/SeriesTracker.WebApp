namespace SeriesTracker.Core.Dtos
{
    /// <summary>
    /// DTO, представляющий активность пользователя.
    /// Наследуется от <see cref="UserDetailDto"/>, добавляя информацию о списках аниме пользователя.
    /// </summary>
    public class UserActivityDTO : UserDetailDto
    {
        /// <summary>
        /// Строка, содержащая идентификаторы аниме, связанных с пользователем.
        /// </summary>
        public string? SeriesIDS { get; set; }

        /// <summary>
        /// Список DTO, представляющих сгуппированную информацию об аниме, связанных с пользователем.
        /// </summary>
        public List<SeriesGroupFullDto>? SeriesGroup { get; set; }
    }
}