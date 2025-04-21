namespace SeriesTracker.Core.Models
{
    /// <summary>
    /// Представляет модель категории для отслеживания аниме.
    /// </summary>
    public class Category
    {
        /// <summary>
        /// Конструктор для создания экземпляра класса <see cref="Category"/>.
        /// </summary>
        /// <param name="id">Уникальный идентификатор категории.</param>
        /// <param name="name">Название категории.</param>
        /// <param name="color">Цвет категории.</param>
        /// <param name="prevColor">Предыдущий цвет категории.</param>
        /// <param name="date">Дата создания или последнего изменения категории.</param>
        private Category(int id, string name, string color, string? prevColor, string date)
        {
            Id = id;
            Name = name;
            Color = color;
            PrevColor = prevColor;
            Date = date;
        }

        /// <summary>
        /// Цвет категории.
        /// </summary>
        public string Color
        {
            get; private set;
        }

        /// <summary>
        /// Дата создания или последнего изменения категории.
        /// </summary>
        public string Date
        {
            get; private set;
        }

        /// <summary>
        /// Уникальный идентификатор категории.
        /// </summary>
        public int Id
        {
            get;
        }

        /// <summary>
        /// Название категории.
        /// </summary>
        public string Name
        {
            get;
        }

        /// <summary>
        /// Предыдущий цвет категории.
        /// </summary>
        public string? PrevColor
        {
            get; private set;
        }

        /// <summary>
        /// Фабричный метод для создания экземпляра класса <see cref="Category"/>.
        /// </summary>
        /// <param name="id">Уникальный идентификатор категории.</param>
        /// <param name="name">Название категории.</param>
        /// <param name="color">Цвет категории.</param>
        /// <param name="prevColor">Предыдущий цвет категории.</param>
        /// <param name="date">Дата создания или последнего изменения категории.</param>
        /// <returns>Новый экземпляр класса <see cref="Category"/>.</returns>
        public static Category Create(int id, string name, string color, string? prevColor, string date)
        {
            Category category = new(id, name, color, prevColor, date);

            return category;
        }

        /// <summary>
        /// Метод для изменения цвета категории.
        /// </summary>
        /// <param name="newColor">Новый цвет категории.</param>
        public void ChangeColor(string newColor)
        {
            PrevColor = Color;  // Сохраняем предыдущий цвет
            Color = newColor;
            Date = DateTime.Now.ToString("s");  // Обновляем дату изменения
        }
    }
}