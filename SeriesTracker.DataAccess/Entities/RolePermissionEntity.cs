using System.ComponentModel.DataAnnotations.Schema;

namespace SeriesTracker.DataAccess.Entities
{
    /// <summary>
    /// Представляет связь между ролью и разрешением.
    /// </summary>
    [Table("RolePermissions")]
    public class RolePermissionEntity
    {
        /// <summary>
        /// Идентификатор разрешения.
        /// </summary>
        [ForeignKey("Permission")]
        public int PermissionId { get; set; }

        /// <summary>
        /// Идентификатор роли.
        /// </summary>
        [ForeignKey("Role")]
        public int RoleId { get; set; }
    }
}