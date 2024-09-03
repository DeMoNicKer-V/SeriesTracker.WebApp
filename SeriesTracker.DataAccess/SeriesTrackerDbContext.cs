using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SeriesTracker.DataAccess.Configurations;
using SeriesTracker.DataAccess.Entities;
using System.Reflection.Metadata;

namespace SeriesTracker.DataAccess
{
    public class SeriesTrackerDbContext(DbContextOptions<SeriesTrackerDbContext> options,
    IOptions<AuthorizationOptions> authOptions) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(SeriesTrackerDbContext).Assembly);

            modelBuilder.ApplyConfiguration(new RolePermissionConfiguration(authOptions.Value));
        }

        public DbSet<SeriesEntity> SeriesEntities { get; set; }
        public DbSet<CategoryEntity> CategoryEntities { get; set; }
        public DbSet<UserEntity> UserEntities { get; set; }
        public DbSet<RoleEntity> RoleEntities { get; set; }

    }
}
