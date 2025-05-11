using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;

namespace SeriesTracker.Tests.ServicesTests
{
    public class ShikimoriServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserReposiory;
        private readonly Mock<IUserSeriesRepository> _mockUserSeriesRepository;
        private readonly Mock<IMapper> __mockMapper;
        private readonly Mock<ILogger<ShikimoriService>> _mockLogger;

        private readonly ShikimoriService _shikimoriService;

        public ShikimoriServiceTests()
        {
            _mockUserReposiory = new Mock<IUserRepository>();
            _mockLogger = new Mock<ILogger<ShikimoriService>>();
            __mockMapper = new Mock<IMapper>();
            _mockUserSeriesRepository = new Mock<IUserSeriesRepository>();

            _shikimoriService = new ShikimoriService(_mockUserSeriesRepository.Object, _mockLogger.Object, __mockMapper.Object, _mockUserReposiory.Object);
        }
    }
}
