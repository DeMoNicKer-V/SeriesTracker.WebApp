using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions
{
    public interface IAnime
    {
        int Id { get; set; }
        string? SubTitle { get; set; }
        string? Title { get; set; }
        int Episodes { get; set; }
        int EpisodesAired { get; set; }
        string? PictureUrl { get; } // Только геттер, т.к. вычисляется
        string? StartDate { get; } // Только геттер, т.к. вычисляется
    }
}
