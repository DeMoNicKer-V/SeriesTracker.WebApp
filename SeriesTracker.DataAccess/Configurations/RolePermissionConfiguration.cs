using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeriesTracker.Core.Enums;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Configurations
{
    /// <summary>
    /// Конфигурация для сущности <see cref="RolePermissionEntity"/>.
    /// Определяет настройки маппинга для таблицы RolePermissions в базе данных.
    /// </summary>
    internal partial class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermissionEntity>
    {
        private readonly AuthorizationOptions _authorization;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="RolePermissionConfiguration"/>.
        /// </summary>
        /// <param name="authorization">Объект <see cref="AuthorizationOptions"/>, содержащий информацию о разрешениях для ролей.</param>
        public RolePermissionConfiguration(AuthorizationOptions authorization)
        {
            _authorization = authorization ?? throw new ArgumentNullException(nameof(authorization));
        }

        /// <summary>
        /// Конфигурирует маппинг для сущности <see cref="RolePermissionEntity"/>.
        /// </summary>
        /// <param name="builder">Объект <see cref="EntityTypeBuilder{RolePermissionEntity}"/>, используемый для конфигурации маппинга.</param>
        public void Configure(EntityTypeBuilder<RolePermissionEntity> builder)
        {
            // Устанавливаем составной ключ для сущности RolePermissionEntity (RoleId и PermissionId).
            builder.HasKey(r => new { r.RoleId, r.PermissionId });

            // Добавляем начальные данные в таблицу RolePermissions.
            builder.HasData(ParseRolePermissions());
        }

        /// <summary>
        /// Преобразует информацию о разрешениях для ролей из объекта <see cref="AuthorizationOptions"/> в массив объектов <see cref="RolePermissionEntity"/>.
        /// </summary>
        /// <returns>Массив объектов <see cref="RolePermissionEntity"/>, представляющих разрешения для ролей.</returns>
        private RolePermissionEntity[] ParseRolePermissions()
        {
            // Преобразуем информацию о разрешениях для ролей из объекта AuthorizationOptions в массив объектов RolePermissionEntity.
            return _authorization.RolePermissions
                .SelectMany(rp => rp.Permissions
                    .Select(p => new RolePermissionEntity
                    {
                        RoleId = (int)Enum.Parse<Role>(rp.Role),
                        PermissionId = (int)Enum.Parse<Permission>(p)
                    }))
                    .ToArray();
        }
    }
}