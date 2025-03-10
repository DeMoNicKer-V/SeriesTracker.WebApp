using System.ComponentModel.DataAnnotations;

namespace SeriesTracker.Core.Models
{
    public class User
    {
        private User(Guid id, string userName, string name, string surName, string email, string password, string avatar, string dateBirth, string regDate, int roleId)
        {
            this.Id = id;
            this.UserName = userName;
            this.Name = name;
            this.SurName = surName;
            this.Email = email;
            this.PasswordHash = password;
            this.Avatar = avatar;
            this.DateBirth = dateBirth;
            this.RegDate = regDate;
            this.RoleId = roleId;
        }

        [Required]
        public Guid Id
        {
            get; set;
        }

        [Required]
        public string Email
        {
            get; private set;
        }

        [Required]
        public string UserName
        {
            get; private set;
        }

        [Required]
        public string PasswordHash
        {
            get; private set;
        }

        [Required]
        public string RegDate
        {
            get; private set;
        }

        [Required]
        public int RoleId
        {
            get; private set;
        }

        public string? Avatar
        {
            get; private set;
        }

        public string? DateBirth
        {
            get; private set;
        }

        public string? SurName
        {
            get; private set;
        }

        public string? Name
        {
            get; private set;
        }

        public static User Create(Guid id, string userName, string name, string surName, string email, string password, string avatar, string dateBirth, string regDate, int roleId = 3)
        {
            return new User(id, userName, name, surName, email, password, avatar, dateBirth, regDate, roleId);
        }
    }
}