using SeriesTracker.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions
{
    public interface IPermissionSevice
    {
        Task<HashSet<Permission>> GetPermissionsAsync(Guid userId);
    }
}
