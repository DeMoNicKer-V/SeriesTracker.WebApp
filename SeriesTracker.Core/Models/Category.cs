﻿using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models
{
    public class Category
    {
        private Category(int id, string title, string color, string prevColor, string date)
        {
            Id = id;
            Title = title;
            Color = color;
            PrevColor = prevColor;
            Date = date;
        }
        public int Id
        {
            get;
        }

        public string Title
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

        public static (Category Category, string Error) Create(int id, string title, string color, string prevColor, string date)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(title))
            {
                error = "Название это обязательное поле";
            }
            if (string.IsNullOrEmpty(color))
            {
                error = "Цвет это обязательное поле";
            }
            Category category = new Category(id, title, color, prevColor, date);

            return (category, error);
        }
    
}
}
