using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SeriesTracker.DataAccess.Entities
{
    /// <summary>
    /// Представляет запись о просмотре аниме пользователем.
    /// </summary>
    [Table("UserSeries")] // Указываем имя таблицы в базе данных
    public class UserSeriesEntity
    {
        /// <summary>
        /// Дата добавления аниме в список пользователя.
        /// </summary>
        public string AddedDate { get; set; } = string.Empty;

        /// <summary>
        /// Идентификатор аниме.
        /// </summary>
        [Required] // Указываем, что поле обязательно
        public int AnimeId { get; set; }

        /// <summary>
        /// Навигационное свойство, представляющее категорию, к которой относится аниме.
        /// </summary>
        [Required] // Указываем, что связь обязательна
        public virtual CategoryEntity Category { get; set; } = null!;

        /// <summary>
        /// Идентификатор категории, к которой относится аниме.
        /// </summary>
        [ForeignKey("Category")] // Указываем внешний ключ
        public int CategoryId { get; set; }

        /// <summary>
        /// Дата последнего изменения записи о просмотре аниме.
        /// </summary>
        public string ChangedDate { get; set; } = string.Empty;

        /// <summary>
        /// Уникальный идентификатор записи о просмотре аниме.
        /// </summary>
        [Key] // Указываем, что это первичный ключ
        public Guid Id { get; set; }
        /// <summary>
        /// Признак, является ли аниме избранным.
        /// </summary>
        public bool IsFavorite { get; set; } = false;

        /// <summary>
        /// Навигационное свойство, представляющее пользователя, который смотрит аниме.
        /// </summary>
        [Required] // Указываем, что связь обязательна
        public virtual UserEntity User { get; set; } = null!;

        /// <summary>
        /// Идентификатор пользователя, который смотрит аниме.
        /// </summary>
        [ForeignKey("User")] // Указываем внешний ключ
        public Guid UserId { get; set; }
        /// <summary>
        /// Количество просмотренных эпизодов.
        /// </summary>
        public int WatchedEpisodes { get; set; } = 0;
    }
}