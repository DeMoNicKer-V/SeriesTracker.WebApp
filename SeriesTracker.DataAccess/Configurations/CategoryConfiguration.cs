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
            builder.HasKey(x => x.Id);
            builder.Property(s => s.Title).IsRequired();
            builder.HasData(new CategoryEntity { Id = 1, Title = "Запланировано" });
            builder.HasData(new CategoryEntity { Id = 2, Title = "Смотрю" });
            builder.HasData(new CategoryEntity { Id = 3, Title = "Просмотрено" });
        }
    }
}
