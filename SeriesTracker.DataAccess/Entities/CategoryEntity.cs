using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.DataAccess.Entities
{
    public class CategoryEntity
    {
        public int Id
        {
            get; set;
        }

        public required string Title
        {
            get; set;
        }
    }
}
