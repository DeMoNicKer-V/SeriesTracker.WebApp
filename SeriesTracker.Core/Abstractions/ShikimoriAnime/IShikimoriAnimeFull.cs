using SeriesTracker.Core.Models.Shikimori;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions
{
    public interface IShikimoriAnimeFull : IShikimoriAnime
    {
        Genre[]? Genres { get; set; }
        Screenshot[]? Screenshots { get; set; }
        Related[]? Relateds { get; set; }
    }
}
