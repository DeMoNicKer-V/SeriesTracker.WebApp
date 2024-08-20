using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models
{
    public class User
    {
        private User(Guid id, int userRoleId, string userName, string name, string surName, string email, string password, string avatar, string dateBirth, string regDate)
        {
            this.Id = id;
            this.UserRoleId = userRoleId;
            this.UserName = userName;
            this.Name = name;
            this.Surname = surName;
            this.Email = email;
            this.PasswordHash = password;
            this.Avatar = avatar;
            this.DateOfBirth = dateBirth;
            this.RegistrationDate = regDate;
        }

        public string Avatar
        {
            get; private set;
        }

        public string DateOfBirth
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

        public string RegistrationDate
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

        public int UserRoleId
        {
            get; private set;
        }

        public static (User User, string Error) Create(Guid id, int userRoleId, string userName, string name, string surName, string email, string password, string avatar, string dateBirth, string regDate)
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
            User user = new User(id, userRoleId, userName, name, surName, email, password, avatar, dateBirth, regDate);

            return (user, error);
        }
    }
}