using Castle.Core.Logging;
using Microsoft.Extensions.Logging;
using Moq;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Core.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.Tests.ServicesTests
{
    public class AuthenticationServiceTests
    {
        private readonly Mock<IUserRepository> _userReposiory;
        private readonly Mock<IJwtProvider> _jwtProvider;
        private readonly Mock<IPasswordHasher> _passwordHasher;
        private readonly Mock<ILogger<AuthenticationService>> _logger;

        private readonly AuthenticationService _authenticationService;

        public AuthenticationServiceTests()
        {
            _userReposiory = new Mock<IUserRepository>();
            _jwtProvider = new Mock<IJwtProvider>();
            _passwordHasher = new Mock<IPasswordHasher>();
            _logger = new Mock<ILogger<AuthenticationService>>();

            _authenticationService = new AuthenticationService(_userReposiory.Object, _passwordHasher.Object, _jwtProvider.Object, _logger.Object);
        }

    }
}
