using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models
{
    public class AccessLevel
    {
        public AccessLevel(int id, string name, string description)
        {
            this.Id = id;
            this.Name = name;
            this.Description = description;
        }

        public string Description { get; set; }

        public int Id { get; private set; }

        public string Name { get; private set; }

        public static (AccessLevel AccessLevel, string Error) Create(int id, string name, string description)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(name))
            {
                error = "Название это обязательное поле";
            }
            if (string.IsNullOrEmpty(description))
            {
                error = "Описание это обязательное поле";
            }
            AccessLevel accessLevel = new AccessLevel(id, name, description);

            return (accessLevel, error);
        }
    }
}