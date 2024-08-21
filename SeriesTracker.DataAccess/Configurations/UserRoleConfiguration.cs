using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.DataAccess.Configurations
{
    public class UserRoleConfiguration : IEntityTypeConfiguration<UserRoleEntity>
    {
        public void Configure(EntityTypeBuilder<UserRoleEntity> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(s => s.AccessLevelId).IsRequired();
            builder.Property(s => s.Name).IsRequired();
            builder.HasData(new UserRoleEntity { Id = 1, AccessLevelId = 1, Name = "Администратор" });
            builder.HasData(new UserRoleEntity { Id = 2, AccessLevelId = 2, Name = "Модератор" });
            builder.HasData(new UserRoleEntity { Id = 3, AccessLevelId = 3, Name = "Пользователь" });
        }
    }
}
