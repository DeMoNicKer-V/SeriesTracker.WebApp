using SeriesTracker.Core.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models.Shikimori
{
    public class ShikimoriAnimeBaseFull : ShikimoriAnimeBase, IShikimoriAnimeFull
    {
        public Genre[]? Genres { get; set; }
        public Screenshot[]? Screenshots { get; set; }
        public Related[]? Relateds { get; set; }
    }
}
