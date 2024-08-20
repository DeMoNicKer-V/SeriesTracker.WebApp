using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.DataAccess.Entities
{
    public class AccessLevelEntity
    {
        public required string Description { get; set; }

        public int Id { get; set; }

        public required string Name { get; set; }
    }
}
