using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Configurations
{
    /// <summary>
    /// Конфигурация для сущности <see cref="UserEntity"/>.
    /// Определяет настройки маппинга для таблицы Users в базе данных.
    /// </summary>
    internal class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        /// <summary>
        /// Конфигурирует маппинг для сущности <see cref="UserEntity"/>.
        /// </summary>
        /// <param name="builder">Объект <see cref="EntityTypeBuilder{UserEntity}"/>, используемый для конфигурации маппинга.</param>
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            // Устанавливаем первичный ключ для сущности UserEntity.
            builder.HasKey(x => x.Id);

            // Конфигурируем связь "многие ко многим" между пользователями и ролями через таблицу UserRoleEntity.
            builder.HasOne(u => u.Role)
                .WithMany(r => r.Users).HasForeignKey(u => u.RoleId);
        }
    }
}