using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.DataAccess.Entities
{
    public class UserRoleEntity
    {
        public int Id { get; set; }

        public int AccessLevelId { get; set; }

        public required string Name { get; set; }
    }
}
