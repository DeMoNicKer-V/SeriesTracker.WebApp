using SeriesTracker.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Core.Abstractions
{
    public interface IAccessLevelService
    {
        Task<int> CreateAccessLevel(AccessLevel accessLevel);
        Task<int> DeleteAccessLevel(int id);
        Task<List<AccessLevel>> GetAccessLevelList();
        Task<AccessLevel> GetAccessLevelById(int id);
        Task<int> UpdateAccessLevel(int id, string name, string description);
    }
}
