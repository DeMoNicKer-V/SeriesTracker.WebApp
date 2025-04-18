using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SeriesTracker.DataAccess.Entities
{
    /// <summary>
    /// Представляет информацию о разрешении.
    /// </summary>
    [Table("Permissions")]
    public class PermissionEntity
    {
        /// <summary>
        /// Уникальный идентификатор разрешения.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Название разрешения.
        /// </summary>
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Навигационное свойство, представляющее список ролей, которым предоставлено данное разрешение.
        /// </summary>
        public ICollection<RoleEntity> Roles { get; set; } = [];
    }
}