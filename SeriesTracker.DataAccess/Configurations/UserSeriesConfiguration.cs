using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Configurations
{
    /// <summary>
    /// Конфигурация для сущности <see cref="UserSeriesEntity"/>.
    /// Определяет настройки маппинга для таблицы UserSeries в базе данных.
    /// </summary>
    internal class UserSeriesConfiguration : IEntityTypeConfiguration<UserSeriesEntity>
    {
        /// <summary>
        /// Конфигурирует маппинг для сущности <see cref="UserSeriesEntity"/>.
        /// </summary>
        /// <param name="builder">Объект <see cref="EntityTypeBuilder{UserSeriesEntity}"/>, используемый для конфигурации маппинга.</param>
        public void Configure(EntityTypeBuilder<UserSeriesEntity> builder)
        {
            // Устанавливаем первичный ключ для сущности UserSeriesEntity.
            builder.HasKey(r => r.Id);

            // Создаем индекс для поля UserId для повышения производительности запросов.
            builder.HasIndex(us => us.UserId)
                .HasDatabaseName("IX_UserSeriesEntities_UserId");

            // Конфигурируем связь "один ко многим" между пользователем и UserSeriesEntity.
            builder.HasOne(us => us.User)
                .WithMany(u => u.UserSeries)
                .HasForeignKey(us => us.UserId);

            // Конфигурируем связь "один ко многим" между категорией и UserSeriesEntity.
            builder.HasOne(s => s.Category)
                .WithMany(c => c.Series)
                .HasForeignKey(s => s.CategoryId);
        }
    }
}