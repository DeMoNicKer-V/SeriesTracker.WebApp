using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Contracts
{
    public record UserResponse
      (
        Guid Id,
          string Email,
          string UserName
      );
}
