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

        public static (Category Category, string Error) Create(int id, string name, string color, string prevColor, string date)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(name))
            {
                error = "Название это обязательное поле";
            }
            if (string.IsNullOrEmpty(color))
            {
                error = "Цвет это обязательное поле";
            }
            Category category = new Category(id, name, color, prevColor, date);

            return (category, error);
        }

    }
}
