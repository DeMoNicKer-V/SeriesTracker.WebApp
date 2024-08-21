using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;

namespace SeriesTracker.Application.Services
{
    public class AccessLevelService : IAccessLevelService
    {
        private readonly IAccessLevelRepository _accessLevelRepository;

        public AccessLevelService(IAccessLevelRepository accessLevelRepository)
        {
            _accessLevelRepository = accessLevelRepository;
        }

        public async Task<int> CreateAccessLevel(AccessLevel accessLevel)
        {
            return await _accessLevelRepository.CreateAccessLevel(accessLevel);
        }

        public async Task<int> DeleteAccessLevel(int id)
        {
            return await _accessLevelRepository.DeleteAccessLevel(id);
        }

        public async Task<AccessLevel> GetAccessLevelById(int id)
        {
            return await _accessLevelRepository.GetAccessLevelById(id);
        }

        public async Task<List<AccessLevel>> GetAccessLevelList()
        {
            return await _accessLevelRepository.GetAccessLevelList();
        }

        public async Task<int> UpdateAccessLevel(int id, string name, string description)
        {
            return await _accessLevelRepository.UpdateAccessLevel(id, name, description);
        }
    }
}