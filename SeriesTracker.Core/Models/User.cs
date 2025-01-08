using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models
{
    public class User
    {
        private User(Guid id, string userName, string name, string surName, string email, string password, string avatar, string dateBirth, string regDate, int roleId)
        {
            this.Id = id;
            this.UserName = userName;
            this.Name = name;
            this.Surname = surName;
            this.Email = email;
            this.PasswordHash = password;
            this.Avatar = avatar;
            this.DateBirth = dateBirth;
            this.RegDate = regDate;
            this.RoleId = roleId;
        }

        public string Avatar
        {
            get; private set;
        }

        public string DateBirth
        {
            get; private set;
        }

        public string Email
        {
            get; private set;
        }

        public Guid Id
        {
            get; set;
        }

        public string Name
        {
            get; private set;
        }

        public string PasswordHash
        {
            get; private set;
        }

        public string RegDate
        {
            get; private set;
        }

        public string Surname
        {
            get; private set;
        }

        public string UserName
        {
            get; private set;
        }

        public int RoleId
        {
            get; private set;
        }


        public static (User User, string Error) Create(Guid id, string userName, string name, string surName, string email, string password, string avatar, string dateBirth, string regDate, int roleId = 3)
        {
            string error = string.Empty;
            if (string.IsNullOrEmpty(userName))
            {
                error = "Никнейм это обязательное поле";
            }
            if (string.IsNullOrEmpty(email))
            {
                error = "Email это обязательное поле";
            }
            if (string.IsNullOrEmpty(password))
            {
                error = "Пароль это обязательное поле";
            }
            if (string.IsNullOrEmpty(dateBirth))
            {
                error = "Дата рождения это обязательное поле";
            }
            User user = new User(id, userName, name, surName, email, password, avatar, dateBirth, regDate, roleId);

            return (user, error);
        }
    }
}