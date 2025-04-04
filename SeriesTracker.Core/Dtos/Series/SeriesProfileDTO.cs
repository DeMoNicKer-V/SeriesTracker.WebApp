using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Dtos.Series
{
    public class SeriesProfileDTO
    {
        public List<SeriesGroupDto> CategoryGroups { get; set; } = [];
        public string LastFiveSeries { get; set; } = string.Empty;
    }
}
