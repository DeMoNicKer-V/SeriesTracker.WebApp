using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeriesTracker.Core.Enums;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Configurations
{
    /// <summary>
    /// Конфигурация для сущности <see cref="PermissionEntity"/>.
    /// Определяет настройки маппинга для таблицы Permissions в базе данных.
    /// </summary>
    internal class PermissionConfiguration : IEntityTypeConfiguration<PermissionEntity>
    {
        /// <summary>
        /// Конфигурирует маппинг для сущности <see cref="PermissionEntity"/>.
        /// </summary>
        /// <param name="builder">Объект <see cref="EntityTypeBuilder{PermissionEntity}"/>, используемый для конфигурации маппинга.</param>
        public void Configure(EntityTypeBuilder<PermissionEntity> builder)
        {
            // Устанавливаем первичный ключ для сущности PermissionEntity.
            builder.HasKey(x => x.Id);

            // Создаем начальные данные для таблицы Permissions на основе значений перечисления Permission.
            var permissions = Enum
                .GetValues<Permission>()
                .Select(p => new PermissionEntity
                {
                    Id = (int)p,
                    Name = p.ToString(),
                });

            // Добавляем начальные данные в таблицу Permissions.
            builder.HasData(permissions);
        }
    }
}