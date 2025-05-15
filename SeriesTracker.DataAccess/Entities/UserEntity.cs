using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SeriesTracker.DataAccess.Entities
{
    /// <summary>
    /// Представляет информацию о пользователе.
    /// </summary>
    [Table("Users")]
    public class UserEntity
    {
        /// <summary>
        /// URL аватара пользователя.
        /// </summary>
        public string? Avatar { get; set; }

        /// <summary>
        /// Дата рождения пользователя.
        /// </summary>
        public string? DateBirth { get; set; }

        /// <summary>
        /// Адрес электронной почты пользователя.
        /// </summary>
        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Уникальный идентификатор пользователя.
        /// </summary>
        [Key]
        public Guid Id { get; set; }

        /// <summary>
        /// Имя пользователя.
        /// </summary>
        [MaxLength(255)]
        public string? Name { get; set; }

        /// <summary>
        /// Хеш пароля пользователя.
        /// </summary>
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>
        /// Дата регистрации пользователя.
        /// </summary>
        public string RegDate { get; set; } = string.Empty;

        /// <summary>
        /// Идентификатор роли пользователя.
        /// </summary>
        public int RoleId { get; set; }

        /// <summary>
        /// Навигационное свойство, представляющее роль пользователя.
        /// </summary>
        public RoleEntity Role { get; set; } = new();

        /// <summary>
        /// Фамилия пользователя.
        /// </summary>
        [MaxLength(255)]
        public string? SurName { get; set; }

        /// <summary>
        /// Имя пользователя (логин).
        /// </summary>
        [Required]
        [MaxLength(255)]
        public string UserName { get; set; } = string.Empty;

        /// <summary>
        /// Навигационное свойство, представляющее список аниме, которые смотрит пользователь.
        /// </summary>
        public ICollection<UserSeriesEntity> UserSeries { get; set; } = [];
    }
}