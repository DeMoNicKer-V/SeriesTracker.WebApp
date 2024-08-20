using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models
{
    public class UserRole
    {
        private UserRole(int id, int accessLevelId, string name)
        {
            this.Id = id;
            this.AccessLevelId = accessLevelId;
            this.Name = name;
        }

        public int Id { get; set; }

        public int AccessLevelId { get; private set; }

        public string Name { get; private set; }

        public static (UserRole UserRole, string Error) Create(int id, int accessLevelId, string name)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(name))
            {
                error = "Название это обязательное поле";
            }
            if (accessLevelId <= 0)
            {
                error = "Уровень доступа должен быть выбран.";
            }
            UserRole userRole = new UserRole(id, accessLevelId, name);

            return (userRole, error);
        }
    }
}
