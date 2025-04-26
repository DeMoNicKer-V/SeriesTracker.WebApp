using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SeriesTracker.DataAccess.Entities
{
    /// <summary>
    /// Представляет информацию о категории для аниме пользователя.
    /// </summary>
    [Table("Categories")]
    public class CategoryEntity
    {
        /// <summary>
        /// Цвет категории.
        /// </summary>
        [Required]
        [MaxLength(7)]
        public string Color { get; set; } = string.Empty;

        /// <summary>
        /// Дата изменение категории.
        /// </summary>
        [Required]
        public string Date { get; set; } = string.Empty;

        /// <summary>
        /// Уникальный идентификатор категории.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Название категории.
        /// </summary>
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Предыдущий цвет категории.
        /// </summary>
        [MaxLength(7)]
        public string? PrevColor { get; set; }

        /// <summary>
        /// Навигационное свойство, представляющее список аниме, относящихся к данной категории.
        /// </summary>
        public ICollection<UserSeriesEntity> Series { get; set; } = [];
    }
}