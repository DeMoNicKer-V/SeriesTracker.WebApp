namespace SeriesTracker.Core.Models
{
    public class Category
    {
        private Category(int id, string name, string color, string prevColor, string date)
        {
            Id = id;
            Name = name;
            Color = color;
            PrevColor = prevColor;
            Date = date;
        }
        public int Id
        {
            get;
        }

        public string Name
        {
            get;
        }

        public string Color
        {
            get;
        }

        public string PrevColor
        {
            get;
        }

        public string Date
        {
            get;
        }

        // Фабричный метод 
        public static Category Create(int id, string name, string color, string prevColor, string date)
        {
            // Валидация входных параметров
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException("Name cannot be null or empty.", nameof(name));
            }

            if (string.IsNullOrEmpty(color))
            {
                throw new ArgumentException("Color cannot be null or empty.", nameof(color));
            }
            Category category = new(id, name, color, prevColor, date);

            return category;
        }

    }
}
