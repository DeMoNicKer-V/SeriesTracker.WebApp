using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models
{
    public class Category
    {
        private Category(int id,string title)
        {
            Id = id;
            Title = title;
        }
        public int Id
        {
            get;
        }

        public string Title
        {
            get;
        }

        public static (Category Category, string Error) Create(int id, string title)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(title))
            {
                error = "Название это обязательное поле.";
            }
            Category category = new Category(id, title);

            return (category, error);
        }
    
}
}
