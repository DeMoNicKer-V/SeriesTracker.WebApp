using Microsoft.Extensions.Logging;
using Moq;
using SeriesTracker.Application.Interfaces.Auth;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Models;
using Xunit;

namespace SeriesTracker.Tests.ServicesTests
{
    public class AuthenticationServiceTests
    {
        private readonly AuthenticationService _authenticationService;
        private readonly Mock<IJwtProvider> _mockJwtProvider;
        private readonly Mock<ILogger<AuthenticationService>> _mockLogger;
        private readonly Mock<IPasswordHasher> _mockPasswordHasher;
        private readonly Mock<IUserRepository> _mockUserReposiory;
        private readonly User _user;
        public AuthenticationServiceTests()
        {
            _mockUserReposiory = new Mock<IUserRepository>();
            _mockJwtProvider = new Mock<IJwtProvider>();
            _mockPasswordHasher = new Mock<IPasswordHasher>();
            _mockLogger = new Mock<ILogger<AuthenticationService>>();
            _user = User.Create(
                Guid.NewGuid(),
                "user1",
                "user1@mail.com",
                "password-hash",
                "name",
                "surname",
                "avatar-url",
                "20-12-1999",
                "20-12-2024"
                ); ;

            _authenticationService = new AuthenticationService(_mockUserReposiory.Object, _mockPasswordHasher.Object, _mockJwtProvider.Object, _mockLogger.Object);
        }

        // Тест, проверяющий, что метод CheckUserExists возвращает ожидаемый результат (true или false) в зависимости от того, существует ли пользователь с указанным значением (value) в указанном поле (email или username).
        [Theory]
        [InlineData("user1@mail.com", "email", false)]
        [InlineData("nonexist@mail.com", "email", true)]
        [InlineData("user1", "username", false)]
        [InlineData("nonexistuser", "username", true)]
        public async Task CheckUserExists_ReturnExpectedResult(string value, string field, bool expectedResult)
        {
            // Arrange: Подготовка данных для теста.
            bool isUser = false;

            // Act: Выполнение тестируемого кода
            switch (field.ToLower())
            {
                case "email":
                    _mockUserReposiory.Setup(repo => repo.GetUserByEmail(value)).ReturnsAsync(expectedResult ? _user : null as User);
                    isUser = await _authenticationService.EmailExists(value);
                    break;

                case "username":
                    _mockUserReposiory.Setup(repo => repo.GetUserByUserName(value)).ReturnsAsync(expectedResult ? _user : null as User);
                    isUser = await _authenticationService.UserNameExists(value);
                    break;

                default:
                    throw new ArgumentException("Invalid field value");
            }

            // Assert: Проверка результатов теста.
            Assert.Equal(expectedResult, isUser);
        }

        // Тест, проверяющий, что метод LoginUser возвращает токен, если указан правильный email и пароль, и пустую строку, если указан неверный email или пароль.
        [Theory]
        [InlineData("user1@email.com", "password-hash", true)]
        [InlineData("user1@email.com", "wrong-password", false)]
        [InlineData("", "password-hash", false)]
        public async Task LoginUser_ReturnsToken(string email, string password, bool isValidPassword)
        {
            // Arrange: Подготовка данных для теста.
            string expectedToken = "testtoken";

            // Настраиваем Mock-объекты
            _mockUserReposiory.Setup(repo => repo.GetUserByEmail(email)).ReturnsAsync(!string.IsNullOrEmpty(email) ? _user : null as User);
            _mockJwtProvider.Setup(prov => prov.GenerateToken(_user)).Returns(expectedToken);
            _mockPasswordHasher.Setup(hash => hash.Verify(password, _user.PasswordHash)).Returns(isValidPassword);

            // Act: Выполнение тестируемого кода
            string token = await _authenticationService.Login(email, password);

            // Assert: Проверка результатов теста
            if (isValidPassword && !string.IsNullOrEmpty(email))
            {
                Assert.Equal(expectedToken, token);
                _mockJwtProvider.Verify(prov => prov.GenerateToken(_user), Times.Once);
            }
            else
            {
                Assert.True(string.IsNullOrEmpty(token));
                _mockJwtProvider.Verify(prov => prov.GenerateToken(_user), Times.Never);
            }

            // Проверяем, что методы GetUserByEmail и Verify были вызваны
            _mockUserReposiory.Verify(repo => repo.GetUserByEmail(email), Times.Once);
            _mockPasswordHasher.Verify(hash => hash.Verify(password, _user.PasswordHash), Times.Once);
        }

        // Тест, проверяющий, что метод Register успешно регистрирует нового пользователя с валидными данными и возвращает Guid идентификатор созданного пользователя.
        [Fact]
        public async Task Register_ValidData_ReturnsGuid()
        {
            // Arrange: Подготовка данных для теста.
            string userName = "testuser";
            string email = "test@example.com";
            string password = "password123";
            string? avatar = "avatar.jpg";
            string? name = "Test";
            string? surName = "User";
            string? dateBirth = "1990-01-01";
            string hashedPassword = "hashedPassword";
            Guid expectedUserId = Guid.NewGuid();

            // Настраиваем Mock-объекты
            _mockPasswordHasher.Setup(hasher => hasher.Generate(password)).Returns(hashedPassword);
            _mockUserReposiory.Setup(repo => repo.CreateUser(It.IsAny<User>())).ReturnsAsync(expectedUserId);

            // Act: Выполнение тестируемого кода
            Guid actualUserId = await _authenticationService.Register(userName, email, password, avatar, name, surName, dateBirth);

            // Assert: Проверка результатов теста
            Assert.Equal(expectedUserId, actualUserId);

            // Проверяем, что методы вызывались
            _mockPasswordHasher.Verify(hasher => hasher.Generate(password), Times.Once);
            _mockUserReposiory.Verify(repo => repo.CreateUser(It.Is<User>(user =>
                user.UserName == userName &&
                user.Email == email &&
                user.PasswordHash == hashedPassword &&
                user.Avatar == avatar &&
                user.Name == name &&
                user.SurName == surName
            )), Times.Once);
        }
    }
}