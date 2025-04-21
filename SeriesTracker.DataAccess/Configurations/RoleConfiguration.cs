using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeriesTracker.Core.Enums;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Configurations
{
    /// <summary>
    /// Конфигурация для сущности <see cref="RoleEntity"/>.
    /// Определяет настройки маппинга для таблицы Roles в базе данных.
    /// </summary>
    internal class RoleConfiguration : IEntityTypeConfiguration<RoleEntity>
    {
        /// <summary>
        /// Конфигурирует маппинг для сущности <see cref="RoleEntity"/>.
        /// </summary>
        /// <param name="builder">Объект <see cref="EntityTypeBuilder{RoleEntity}"/>, используемый для конфигурации маппинга.</param>
        public void Configure(EntityTypeBuilder<RoleEntity> builder)
        {
            // Устанавливаем первичный ключ для сущности RoleEntity.
            builder.HasKey(x => x.Id);

            // Конфигурируем связь "многие ко многим" между ролями и разрешениями через таблицу RolePermissionEntity.
            builder.HasMany(r => r.Permissions)
                .WithMany(p => p.Roles)
                .UsingEntity<RolePermissionEntity>(
                    p => p.HasOne<PermissionEntity>().WithMany().HasForeignKey(r => r.PermissionId),
                    r => r.HasOne<RoleEntity>().WithMany().HasForeignKey(u => u.RoleId));

            // Создаем начальные данные для таблицы Roles на основе значений перечисления Role.
            var roles = Enum
                .GetValues<Role>()
                .Select(r => new RoleEntity
                {
                    Id = (int)r,
                    Name = r.ToString(),
                });

            // Добавляем начальные данные в таблицу Roles.
            builder.HasData(roles);
        }
    }
}