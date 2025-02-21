using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeriesTracker.Core.Enums;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Configurations
{
    public class RoleConfiguration : IEntityTypeConfiguration<RoleEntity>
    {
        public void Configure(EntityTypeBuilder<RoleEntity> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasMany(r => r.Permissions).
                WithMany(p => p.Roles).
                UsingEntity<RolePermissionEntity>(
                p => p.HasOne<PermissionEntity>().WithMany().HasForeignKey(r => r.PermissionId),
                r => r.HasOne<RoleEntity>().WithMany().HasForeignKey(u => u.RoleId));

            var roles = Enum
                .GetValues<Role>()
                .Select(r => new RoleEntity
                {
                    Id = (int)r,
                    Name = r.ToString(),
                });

            builder.HasData(roles);
        }
    }
}
