using SeriesTracker.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.DataAccess.Dtos.User
{
    public class UserDto
    {
        public Guid Id
        {
            get; set;
        }
        public string UserName { get; set; }

        public string Email
        {
            get; set;
        }

        public string RegDate
        {
            get; set;
        }
        public ICollection<RoleEntity> Roles { get; set; } = [];

    }
}
