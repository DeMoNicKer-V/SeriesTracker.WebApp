using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SeriesTracker.DataAccess.Entities
{
    /// <summary>
    /// Представляет роль пользователя в системе.
    /// </summary>
    [Table("Roles")]
    public class RoleEntity
    {
        /// <summary>
        /// Уникальный идентификатор роли.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Название роли.
        /// </summary>
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Навигационное свойство, представляющее список разрешений, связанных с ролью.
        /// </summary>
        public ICollection<PermissionEntity> Permissions { get; set; } = [];

        /// <summary>
        /// Навигационное свойство, представляющее список пользователей, связанных с ролью.
        /// </summary>
        public ICollection<UserEntity> Users { get; set; } = [];
    }
}