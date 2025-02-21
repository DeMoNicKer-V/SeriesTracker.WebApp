using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Configurations
{
    public class UserSeriesConfiguration : IEntityTypeConfiguration<UserSeriesEntity>
    {
        public void Configure(EntityTypeBuilder<UserSeriesEntity> builder)
        {
            builder.HasKey(r => r.Id);

            builder
                .HasOne(us => us.User)
                .WithMany(u => u.UserSeries)
                .HasForeignKey(us => us.UserId);

            builder
                .HasOne(s => s.Category)
                .WithMany(c => c.Series)
                .HasForeignKey(s => s.CategoryId);
        }
    }
}