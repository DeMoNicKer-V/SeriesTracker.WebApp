using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Application.Interfaces.Auth
{
    public interface IJwtProvider
    {
        public string GenerateToken(User user);
    }
}
