﻿using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.DataAccess.Configurations
{
    internal class CategoryConfiguration : IEntityTypeConfiguration<CategoryEntity>
    {
        public void Configure(EntityTypeBuilder<CategoryEntity> builder)
        {
            var date = DateTime.Now.ToString("s");
            builder.HasKey(x => x.Id);
            builder.Property(s => s.Title).IsRequired();
            builder.HasData(new CategoryEntity { Id = 1, Title = "Запланировано", Color = "#6DBA91", Date = date });
            builder.HasData(new CategoryEntity { Id = 2, Title = "Смотрю", Color = "#4DA8DA", Date = date });
            builder.HasData(new CategoryEntity { Id = 3, Title = "Просмотрено", Color = "#F9A602", Date = date });
            builder.HasData(new CategoryEntity { Id = 4, Title = "Отложено", Color = "#999999", Date = date });
            builder.HasData(new CategoryEntity { Id = 5, Title = "Брошено", Color = "#E74C3C", Date = date });
        }
    }
}
