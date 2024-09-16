using SeriesTracker.Core.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Models
{
    public class UserSeriesService : IUserSeriesService
    {
        private readonly IUserSeriesRepository _userSeriesRepository;

        public UserSeriesService(IUserSeriesRepository userSeriesRepository)
        {
            _userSeriesRepository = userSeriesRepository;
        }

        public async Task<Guid> CreateAsync(UserSeries model)
        {
            return await _userSeriesRepository.CreateAsync(model);
        }
    }
}
