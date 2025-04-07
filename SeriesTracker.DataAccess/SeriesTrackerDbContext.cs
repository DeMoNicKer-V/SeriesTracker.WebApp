using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SeriesTracker.DataAccess.Configurations;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess
{
    /// <summary>
    /// <see cref="DbContext"/> для приложения SeriesTracker. Отвечает за взаимодействие с базой данных.
    /// </summary>
    /// <param name="options">Опции для DbContext, такие как строка подключения.</param>
    /// <param name="authOptions">Опции авторизации, используемые для конфигурации разрешений ролей.</param>
    public class SeriesTrackerDbContext(
        DbContextOptions<SeriesTrackerDbContext> options,
        IOptions<AuthorizationOptions> authOptions) : DbContext(options)
    {
        /// <summary>
        /// <see cref="DbSet{TEntity}"/> для сущностей <see cref="CategoryEntity"/>.
        /// </summary>
        public DbSet<CategoryEntity> CategoryEntities { get; set; }

        /// <summary>
        /// <see cref="DbSet{TEntity}"/> для сущностей <see cref="RoleEntity"/>.
        /// </summary>
        public DbSet<RoleEntity> RoleEntities { get; set; }

        /// <summary>
        /// <see cref="DbSet{TEntity}"/> для сущностей <see cref="UserEntity"/>.
        /// </summary>
        public DbSet<UserEntity> UserEntities { get; set; }

        /// <summary>
        /// <see cref="DbSet{TEntity}"/> для сущностей <see cref="UserSeriesEntity"/>.
        /// </summary>
        public DbSet<UserSeriesEntity> UserSeriesEntities { get; set; }

        /// <summary>
        /// Конфигурирует модель базы данных.
        /// Этот метод вызывается при создании модели для контекста.
        /// </summary>
        /// <param name="modelBuilder"><see cref="ModelBuilder"/>, используемый для создания модели.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Применяем конфигурации сущностей из сборок (Assemblies).
            // Это позволяет разделить конфигурацию сущностей на отдельные классы.
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(SeriesTrackerDbContext).Assembly);

            // Применяем конфигурацию разрешений ролей (Role Permissions).
            // Эта конфигурация может включать в себя начальные данные для ролей и разрешений.
            modelBuilder.ApplyConfiguration(new RolePermissionConfiguration(authOptions.Value));
        }
    }
}