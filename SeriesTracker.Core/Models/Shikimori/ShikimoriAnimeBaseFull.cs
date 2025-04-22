using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnimeBaseFull: ShikimoriAnimeBase
    {
        public Screenshot[]? Screenshots { get; set; }
        public IEnumerable<Related>? Relateds { get; set; }
    }
}
