using System.ComponentModel.DataAnnotations.Schema;

namespace SeriesTracker.DataAccess.Entities
{
    /// <summary>
    /// Представляет связь между пользователем и ролью.
    /// </summary>
    [Table("UserRoles")]
    public class UserRoleEntity
    {
        /// <summary>
        /// Идентификатор роли.
        /// </summary>
        [ForeignKey("Role")]
        public int RoleId { get; set; }

        /// <summary>
        /// Идентификатор пользователя.
        /// </summary>
        [ForeignKey("User")]
        public Guid UserId { get; set; }
    }
}