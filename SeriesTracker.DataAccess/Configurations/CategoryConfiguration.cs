using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using SeriesTracker.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SeriesTracker.Core.Enums;

namespace SeriesTracker.DataAccess.Configurations
{
    internal class CategoryConfiguration : IEntityTypeConfiguration<CategoryEntity>
    {
        private readonly Dictionary<Category, string> categoryColors = 
            new()
            {
                    { Category.Запланировано, "#6DBA91" },
                        { Category.Смотрю, "#4DA8DA" },
                            { Category.Просмотрено, "#F9A602" },
                                { Category.Пересматриваю, "#FFA500" },
                                    { Category.Отложено, "#999999" },
                                        { Category.Брошено, "#E74C3C" }
            };

        private readonly string dateNow = DateTime.Now.ToString("s");

        public void Configure(EntityTypeBuilder<CategoryEntity> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(s => s.Name).IsRequired();
            builder.Property(s => s.Color).IsRequired();
            builder.Property(s => s.Date).IsRequired();

            var categories = Enum
                .GetValues<Category>()
                .Select(r => new CategoryEntity
                {
                    Id = (int)r,
                    Name = r.ToString(),
                    Color = categoryColors[r],
                    Date = dateNow
                });

            builder.HasData(categories);
        }
    }
}