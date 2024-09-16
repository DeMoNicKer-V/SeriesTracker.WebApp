using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Core.Abstractions
{
    public interface IUserSeriesRepository
    {
        Task<Guid> CreateAsync(UserSeries model);
    }
}
