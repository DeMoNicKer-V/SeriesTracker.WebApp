using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SeriesTracker.Core.Enums;
using SeriesTracker.DataAccess.Entities;

namespace SeriesTracker.DataAccess.Configurations
{
    /// <summary>
    /// Конфигурация для сущности <see cref="CategoryEntity"/>.
    /// Определяет настройки маппинга для таблицы Categories в базе данных.
    /// </summary>
    internal class CategoryConfiguration : IEntityTypeConfiguration<CategoryEntity>
    {
        /// <summary>
        /// Словарь, содержащий соответствие между значениями перечисления <see cref="Category"/> и цветами категорий.
        /// </summary>
        private readonly Dictionary<Category, string> categoryColors =
            new()
            {
                 { Category.Запланировано, "#8FBC8F" },
                 { Category.Смотрю, "#708FC4" },
                 { Category.Просмотрено, "#FFAD4F" },
                 { Category.Пересматриваю, "#9966CC" },
                 { Category.Отложено, "#778899" },
                 { Category.Брошено, "#CD5C5C" }
            };

        /// <summary>
        /// Текущая дата и время в формате ISO 8601 ("s"). Используется для установки даты создания категории.
        /// </summary>
        private readonly string dateNow = DateTime.Now.ToString("s");

        /// <summary>
        /// Конфигурирует маппинг для сущности <see cref="CategoryEntity"/>.
        /// </summary>
        /// <param name="builder">Объект <see cref="EntityTypeBuilder{CategoryEntity}"/>, используемый для конфигурации маппинга.</param>
        public void Configure(EntityTypeBuilder<CategoryEntity> builder)
        {
            // Устанавливаем первичный ключ для сущности CategoryEntity.
            builder.HasKey(x => x.Id);

            // Указываем, что свойство Name является обязательным.
            builder.Property(s => s.Name).IsRequired();

            // Указываем, что свойство Color является обязательным.
            builder.Property(s => s.Color).IsRequired();

            // Указываем, что свойство Date является обязательным.
            builder.Property(s => s.Date).IsRequired();

            // Создаем начальные данные для таблицы Categories на основе значений перечисления Category.
            var categories = Enum
                .GetValues<Category>()
                .Select(r => new CategoryEntity
                {
                    Id = (int)r,
                    Name = r.ToString(),
                    Color = categoryColors[r],
                    Date = dateNow
                });

            // Добавляем начальные данные в таблицу Categories.
            builder.HasData(categories);
        }
    }
}