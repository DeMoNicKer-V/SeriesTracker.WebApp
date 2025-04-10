using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Dtos
{
    public class ShortCategoryDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Color { get; set; }
    }
}
