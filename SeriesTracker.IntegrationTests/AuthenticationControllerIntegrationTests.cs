using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Newtonsoft.Json;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Services;
using System.Net;
using System.Text;

namespace SeriesTracker.IntegrationTests
{
    public class AuthenticationControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public AuthenticationControllerIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        // Тест, проверяющий, что метод CheckInput (CheckEmail или CheckUserName) возвращает 500 InternalServerError, если во время проверки доступности email или username возникает исключение.
        [Theory]
        [InlineData("test@example.com", "email")]
        [InlineData("testusername", "userName")]
        public async Task CheckInput_ExceptionThrown_ReturnsInternalServerError(string inputValue, string route)
        {
            // Arrange: Подготовка данных для теста.
            var mockAuthenticationService = new Mock<IAuthenticationService>();

            if (route == "email")
            {
                mockAuthenticationService.Setup(service => service.EmailExists(inputValue)).ThrowsAsync(new Exception("Error"));
            }
            else if (route == "userName")
            {
                mockAuthenticationService.Setup(service => service.UserNameExists(inputValue)).ThrowsAsync(new Exception("Error"));
            }

            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddScoped(typeof(IAuthenticationService), (sp) => mockAuthenticationService.Object);
                });
            }).CreateClient();

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"/auth/{route}?{route}={inputValue}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод CheckInput (CheckEmail или CheckUserName) возвращает ожидаемый результат (400 BadRequest или 204 NoContent) в зависимости от того, существует ли пользователь с указанным значением (inputValue) в указанном типе поля (route - "email" или "userName").
        [Theory]
        [InlineData("newemail@example.com", false, "email")]
        [InlineData("existingemail@example.com", true, "email")]
        [InlineData("newusername", false, "userName")]
        [InlineData("existingusername", true, "userName")]
        public async Task CheckInput_ReturnsExpectedResult(string inputValue, bool exists, string route)
        {
            // Arrange: Подготовка данных для теста.
            HttpStatusCode expectedStatusCode = exists ? HttpStatusCode.BadRequest : HttpStatusCode.NoContent;

            var mockAuthenticationService = new Mock<IAuthenticationService>();

            if (route == "email")
            {
                mockAuthenticationService.Setup(service => service.EmailExists(inputValue)).ReturnsAsync(exists);
            }
            else if (route == "userName")
            {
                mockAuthenticationService.Setup(service => service.UserNameExists(inputValue)).ReturnsAsync(exists);
            }

            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddScoped(typeof(IAuthenticationService), (sp) => mockAuthenticationService.Object);
                });
            }).CreateClient();

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"/auth/{route}?{route}={inputValue}");

            // Assert: Проверка результатов теста.
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }

        // Тест, проверяющий, что метод Login возвращает 500 InternalServerError, если во время аутентификации пользователя возникает исключение.
        [Fact]
        public async Task Login_ExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            var mockAuthenticationService = new Mock<IAuthenticationService>();
            mockAuthenticationService.Setup(service => service.Login(It.IsAny<string>(), It.IsAny<string>())).ThrowsAsync(new Exception("Error"));

            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddScoped(typeof(IAuthenticationService), (sp) => mockAuthenticationService.Object);
                });
            }).CreateClient();

            LoginUserRequest loginRequest = new("test@example.com", "password");
            var json = JsonConvert.SerializeObject(loginRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PostAsync("/auth/login", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод Login возвращает 200 OK или 400 BadRequest в зависимости от того, были ли введены верные учетные данные.
        [Theory]
        [InlineData("test@example.com", "password")]
        [InlineData("test@example.com", "wrong-password")]
        public async Task Login_ReturnsOkOrBadRequest(string email, string password)
        {
            // Arrange: Подготовка данных для теста.
            var mockAuthenticationService = new Mock<IAuthenticationService>();
            var expectedPassword = "password";
            string? expectedToken = expectedPassword.Equals(password) ? "test_token" : null;
            mockAuthenticationService.Setup(service => service.Login(email, password)).ReturnsAsync(expectedToken);

            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddScoped(typeof(IAuthenticationService), (sp) => mockAuthenticationService.Object);
                });
            }).CreateClient();

            LoginUserRequest loginRequest = new(email, password);
            var json = JsonConvert.SerializeObject(loginRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PostAsync("/auth/login", content);

            // Assert: Проверка результатов теста.
            if (string.IsNullOrEmpty(expectedToken))
            {
                Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            }
            else
            {
                Assert.Equal(HttpStatusCode.OK, response.StatusCode);

                var responseBody = await response.Content.ReadAsStringAsync();
                var deserializedToken = JsonConvert.DeserializeObject<string>(responseBody);
                Assert.Equal(expectedToken, deserializedToken);

                Assert.True(response.Headers.TryGetValues("Set-Cookie", out var cookieValues));
                Assert.Contains(cookieValues, cookie => cookie.StartsWith("secretCookie=test_token"));
            }
        }

        // Тест, проверяющий, что метод Logout возвращает 204 NoContent и удаляет cookie аутентификации при успешном выходе пользователя из системы.
        [Fact]
        public async Task Logout_SuccessfulLogout_ReturnsNoContentAndDeletesCookie()
        {
            // Arrange: Подготовка данных для теста.
            var userName = "testuser";

            var client = _factory.CreateClient();

            client.DefaultRequestHeaders.Add("Cookie", "secretCookie=test_token");

            // Act: Выполнение тестируемого кода
            var response = await client.PostAsync($"/auth/logout/{userName}", null);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            Assert.True(response.Headers.TryGetValues("Set-Cookie", out var cookieValues));
            Assert.Contains(cookieValues, cookie => cookie.StartsWith("secretCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT;"));
        }

        // Тест, проверяющий, что метод Register возвращает 500 InternalServerError, если во время регистрации пользователя возникает исключение.
        [Fact]
        public async Task Register_ExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            var mockAuthenticationService = new Mock<IAuthenticationService>();
            mockAuthenticationService.Setup(service => service.Register(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).ThrowsAsync(new Exception("Error"));

            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddScoped(typeof(IAuthenticationService), (sp) => mockAuthenticationService.Object);
                });
            }).CreateClient();

            var registerRequest = new CreateUserRequest
            (
                "test@example.com",
                "password",
                "testuser",
                "avatar.jpg",
                "Test",
                "User",
                DateTime.Now.AddYears(-20).ToString("s")
            );
            var json = JsonConvert.SerializeObject(registerRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PostAsync("/auth/register", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод Register возвращает 400 BadRequest, если в запросе на регистрацию переданы невалидные данные (пустые email, username, password).
        [Fact]
        public async Task Register_InvalidData_ReturnsBadRequest()
        {
            // Arrange: Подготовка данных для теста.
            var client = _factory.CreateClient();

            var registerRequest = new CreateUserRequest("", "", "", "", "", "", "");
            var json = JsonConvert.SerializeObject(registerRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PostAsync("/auth/register", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        // Тест, проверяющий, что метод Register возвращает 201 Created при успешной регистрации нового пользователя.
        [Fact]
        public async Task Register_SuccessfulRegistration_ReturnsCreated()
        {
            // Arrange: Подготовка данных для теста.
            var mockAuthenticationService = new Mock<IAuthenticationService>();
            mockAuthenticationService.Setup(service => service.Register(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(Guid.NewGuid()); // Assuming register returns Guid now.

            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddScoped(typeof(IAuthenticationService), (sp) => mockAuthenticationService.Object);
                });
            }).CreateClient();

            var registerRequest = new CreateUserRequest
            (
                "test@example.com",
                "password",
                "testuser",
                "avatar.jpg",
                "Test",
                "User",
                DateTime.Now.AddYears(-20).ToString("s")
            );
            var json = JsonConvert.SerializeObject(registerRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PostAsync("/auth/register", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        // Тест, проверяющий, что метод Verify возвращает 500 InternalServerError, если во время проверки учетных данных возникает исключение.
        [Fact]
        public async Task Verify_ExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            var mockAuthenticationService = new Mock<IAuthenticationService>();
            mockAuthenticationService.Setup(service => service.Verify(It.IsAny<string>(), It.IsAny<string>())).ThrowsAsync(new Exception("Error"));

            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddScoped(typeof(IAuthenticationService), (sp) => mockAuthenticationService.Object);
                });
            }).CreateClient();

            var loginRequest = new LoginUserRequest("test@example.com", "password");
            var json = JsonConvert.SerializeObject(loginRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PostAsync("/auth/verify", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод Verify возвращает 400 BadRequest, если в запросе на проверку учетных данных переданы невалидные данные (пустые email, password).
        [Fact]
        public async Task Verify_InvalidData_ReturnsBadRequest()
        {
            // Arrange: Подготовка данных для теста.
            var client = _factory.CreateClient();

            var loginRequest = new LoginUserRequest("", "");
            var json = JsonConvert.SerializeObject(loginRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PostAsync("/auth/verify", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        // Тест, проверяющий, что метод Verify возвращает 204 NoContent при успешной проверке учетных данных пользователя.
        [Fact]
        public async Task Verify_SuccessfulVerification_ReturnsNoContent()
        {
            // Arrange: Подготовка данных для теста.
            var mockAuthenticationService = new Mock<IAuthenticationService>();
            mockAuthenticationService.Setup(service => service.Verify("test@example.com", "password")).ReturnsAsync(true);

            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddScoped(typeof(IAuthenticationService), (sp) => mockAuthenticationService.Object);
                });
            }).CreateClient();

            var loginRequest = new LoginUserRequest("test@example.com", "password");
            var json = JsonConvert.SerializeObject(loginRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PostAsync("/auth/verify", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        // Тест, проверяющий, что метод Verify возвращает 401 Unauthorized, если проверка учетных данных не удалась (неверные email или пароль).
        [Fact]
        public async Task Verify_Unauthorized_ReturnsUnauthorized()
        {
            // Arrange: Подготовка данных для теста.
            var mockAuthenticationService = new Mock<IAuthenticationService>();
            mockAuthenticationService.Setup(service => service.Verify("test@example.com", "wrongpassword")).ThrowsAsync(new UnauthorizedAccessException("Invalid credentials"));

            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddScoped(typeof(IAuthenticationService), (sp) => mockAuthenticationService.Object);
                });
            }).CreateClient();

            var loginRequest = new LoginUserRequest("test@example.com", "wrongpassword");
            var json = JsonConvert.SerializeObject(loginRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PostAsync("/auth/verify", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}