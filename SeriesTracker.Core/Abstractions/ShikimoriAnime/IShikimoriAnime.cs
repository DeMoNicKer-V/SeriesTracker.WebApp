using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions
{
    public interface IShikimoriAnime : IAnime
    {
        double Score { get; set; }
        string? Description { get; set; }
        int Duration { get; set; }
        string? Kind { get; set; }
        string? Status { get; set; }
        string? Rating { get; set; }
    }
}
