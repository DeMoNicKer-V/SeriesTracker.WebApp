using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SeriesTracker.DataAccess.Configurations
{
    internal class AccessLevelConfiguration : IEntityTypeConfiguration<AccessLevelEntity>
    {
        public void Configure(EntityTypeBuilder<AccessLevelEntity> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(s => s.Name).IsRequired();
            builder.Property(s => s.Description).IsRequired();
            builder.HasData(new AccessLevelEntity { Id = 1, Name = "Полный", Description = "Полный доступ ко всем функциям приложения" });
            builder.HasData(new AccessLevelEntity { Id = 2, Name = "Ограниченный", Description = "Ограниченный доступ ко всем функциям приложения" });
            builder.HasData(new AccessLevelEntity { Id = 3, Name = "Пользовательский", Description = "Доступ к базовым функциям приложения. Доступен всем по умолчанию" });
        }
    }
}
