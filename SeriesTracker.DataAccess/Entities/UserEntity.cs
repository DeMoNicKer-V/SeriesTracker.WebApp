using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.DataAccess.Entities
{
    public class UserEntity
    {
        public string? Avatar
        {
            get; set;
        }

        public required string DateOfBirth
        {
            get; set;
        }

        public required string Email
        {
            get; set;
        }

        public Guid Id
        {
            get; set;
        }

        public string? Name
        {
            get; set;
        }

        public required string PasswordHash
        {
            get; set;
        }

        public required string RegistrationDate
        {
            get; set;
        }

        public string? Surname
        {
            get; set;
        }

        public required string UserName
        {
            get; set;
        }

        public int UserRoleId
        {
            get; set;
        }
    }
}
