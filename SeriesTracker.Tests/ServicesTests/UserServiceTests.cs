using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;

namespace SeriesTracker.Tests.ServicesTests
{
    using AutoMapper;
    using Moq;
    using SeriesTracker.Core.Dtos;
    using SeriesTracker.Core.Models;
    using System.Collections.Generic; // Добавьте эту директиву using
    using System.Threading.Tasks;      // Добавьте эту директиву using
    using Xunit;

    public class UserServiceTests
    {
        private readonly Mock<IJwtProvider> _mockJwtProvider;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IPasswordHasher> _mockPasswordHasher;
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockPasswordHasher = new Mock<IPasswordHasher>();
            _mockJwtProvider = new Mock<IJwtProvider>();
            _mockMapper = new Mock<IMapper>();

            _userService = new UserService(_mockUserRepository.Object, _mockPasswordHasher.Object, _mockJwtProvider.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GenerateNewUserToken_UserDoesNotExist_ReturnsEmptyString()
        {
                // Arrange: Подготовка данных для теста.
            string userName = "nonexistentuser";
            _mockUserRepository.Setup(repo => repo.GetUserByUserName(userName)).ReturnsAsync(null as User);

            // Act: Выполнение тестируемого кода.
            string token = await _userService.GenerateNewUserToken(userName);

            // Assert
            Assert.Equal(string.Empty, token);
        }

        [Fact]
        public async Task GenerateNewUserToken_UserExists_ReturnsToken()
        {
                // Arrange: Подготовка данных для теста.
            string userName = "username";
            var user = User.Create(
                Guid.NewGuid(),
                userName,
                "email",
                "password",
                "name",
                "surname",
                "avatar",
                "datebirth",
                "regDate"
                );
            string expectedToken = "testtoken";

            _mockUserRepository.Setup(repo => repo.GetUserByUserName(userName)).ReturnsAsync(user);
            _mockJwtProvider.Setup(provider => provider.GenerateToken(user)).Returns(expectedToken);

            // Act: Выполнение тестируемого кода.
            string token = await _userService.GenerateNewUserToken(userName);

            // Assert
            Assert.Equal(expectedToken, token);
        }

        [Fact]
        public async Task GetUserById_UserDoesNotExist_ReturnsNull()
        {
                // Arrange: Подготовка данных для теста.
            Guid userId = Guid.NewGuid();
            _mockUserRepository.Setup(repo => repo.GetUserById(userId)).ReturnsAsync(null as User);

            // Act: Выполнение тестируемого кода.
            UserDetailDto? result = await _userService.GetUserById(userId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetUserById_UserExists_ReturnsUserDetailDto()
        {
                // Arrange: Подготовка данных для теста.
            Guid userId = Guid.NewGuid();
            var user = User.Create(
                           userId,
                           "username",
                           "email",
                           "password",
                           "name",
                           "surname",
                           "avatar",
                           "datebirth",
                           "regDate"
                           );
            var userDetailDto = new UserDetailDto { Id = userId, UserName = user.UserName, Email = user.Email, RegDate = user.RegDate };

            _mockUserRepository.Setup(repo => repo.GetUserById(userId)).ReturnsAsync(user);
            _mockMapper.Setup(mapper => mapper.Map<UserDetailDto>(user)).Returns(userDetailDto);

            // Act: Выполнение тестируемого кода.
            UserDetailDto? result = await _userService.GetUserById(userId);

            // Assert
            Assert.Equal(userDetailDto, result);
        }

        [Fact]
        public async Task GetUserByUserName_UserDoesNotExist_ReturnsNull()
        {
                // Arrange: Подготовка данных для теста.
            string userName = "nonexistentuser";
            _mockUserRepository.Setup(repo => repo.GetUserByUserName(userName)).ReturnsAsync(null as User);

            // Act: Выполнение тестируемого кода.
            UserDetailDto? result = await _userService.GetUserByUserName(userName);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetUserByUserName_UserExists_ReturnsUserDetailDto()
        {
                // Arrange: Подготовка данных для теста.
            string userName = "username";
            var user = User.Create(
                Guid.NewGuid(),
                userName,
                "email",
                "password",
                "name",
                "surname",
                "avatar",
                "datebirth",
                "regDate"
                );

            var userDetailDto = new UserDetailDto { Id = user.Id, UserName = user.UserName, Email = user.Email, RegDate = user.RegDate };

            _mockUserRepository.Setup(repo => repo.GetUserByUserName(userName)).ReturnsAsync(user);
            _mockMapper.Setup(mapper => mapper.Map<UserDetailDto>(user)).Returns(userDetailDto);

            // Act: Выполнение тестируемого кода.
            UserDetailDto? result = await _userService.GetUserByUserName(userName);

            // Assert
            Assert.Equal(userDetailDto, result);
        }

        [Fact]
        public async Task GetUserList_ReturnsUserListAndCount()
        {
                // Arrange: Подготовка данных для теста.
            int page = 1;
            var userList = new List<UserDto>
            {
                new UserDto { Id = Guid.NewGuid(), UserName = "user1", Email ="user1@mail.com", RegDate = "20-12-2024" },
                new UserDto { Id = Guid.NewGuid(), UserName = "user2", Email ="user2@mail.com", RegDate = "20-01-2025" },
            };
            int totalCount = 10;
            (List<UserDto>, int) expectedResult = (userList, totalCount);

            _mockUserRepository.Setup(repo => repo.GetUserList(page)).ReturnsAsync(expectedResult);

            // Act: Выполнение тестируемого кода.
            (List<UserDto>, int) result = await _userService.GetUserList(page);

            // Assert
            Assert.Equal(expectedResult.Item1, result.Item1);
            Assert.Equal(expectedResult.Item2, result.Item2);
        }

        [Fact]
        public async Task UpdateUser_UpdateFails_ReturnsFalse()
        {
                // Arrange: Подготовка данных для теста.
            Guid userId = Guid.NewGuid();
            string userName = "newusername";
            string name = "New";
            string surName = "User";
            string email = "new@example.com";
            string password = "newpassword";
            string avatar = "newavatar.jpg";
            string dateBirth = "2000-01-01";
            string passwordHash = "hashedpassword";

            // Setup repository to return false (update fails)
            _mockPasswordHasher.Setup(hasher => hasher.Generate(password)).Returns(passwordHash);
            _mockUserRepository.Setup(repo => repo.UpdateUser(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(false);

            // Act: Выполнение тестируемого кода.
            bool result = await _userService.UpdateUser(userId, userName, name, surName, email, password, avatar, dateBirth);

            // Assert
            Assert.False(result); // Check if the service returns false
        }

        [Fact]
        public async Task UpdateUser_ValidInput_ReturnsTrue()
        {
                // Arrange: Подготовка данных для теста.
            Guid userId = Guid.NewGuid();
            string userName = "newusername";
            string name = "New";
            string surName = "User";
            string email = "new@example.com";
            string password = "newpassword";
            string avatar = "newavatar.jpg";
            string dateBirth = "2000-01-01";
            string passwordHash = "hashedpassword";

            // Setup repository to return true
            _mockPasswordHasher.Setup(hasher => hasher.Generate(password)).Returns(passwordHash);
            _mockUserRepository.Setup(repo => repo.UpdateUser(userId, userName, name, surName, email, passwordHash, avatar, dateBirth)).ReturnsAsync(true);

            // Act: Выполнение тестируемого кода.
            bool result = await _userService.UpdateUser(userId, userName, name, surName, email, password, avatar, dateBirth);

            // Assert
            Assert.True(result); // Check if the service returns true
        }
    }
}