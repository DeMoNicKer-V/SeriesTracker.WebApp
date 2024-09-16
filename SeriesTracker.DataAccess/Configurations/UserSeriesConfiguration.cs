using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Reflection.Emit;

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