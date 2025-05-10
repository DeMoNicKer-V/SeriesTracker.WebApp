using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;

namespace SeriesTracker.Tests.ServicesTests
{
    public class ShikimoriServiceTests
    {
        private readonly Mock<IUserRepository> _userReposiory;
        private readonly Mock<IUserSeriesRepository> _userSeriesRepository;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILogger<ShikimoriService>> _logger;

        private readonly ShikimoriService _shikimoriService;

        public ShikimoriServiceTests()
        {
            _userReposiory = new Mock<IUserRepository>();
            _logger = new Mock<ILogger<AuthenticationService>>();
            _mapper = new Mock<IMapper>();
            _userSeriesRepository = new Mock<IUserSeriesRepository>();

            _shikimoriService = new ShikimoriService(_userSeriesRepository.Object, _logger.Object, _mapper.Object, _userReposiory.Object);
        }
    }
}
