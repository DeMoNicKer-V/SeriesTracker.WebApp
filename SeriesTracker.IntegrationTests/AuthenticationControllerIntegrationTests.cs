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

        // ����, �����������, ��� ����� CheckInput (CheckEmail ��� CheckUserName) ���������� 500 InternalServerError, ���� �� ����� �������� ����������� email ��� username ��������� ����������.
        [Theory]
        [InlineData("test@example.com", "email")]
        [InlineData("testusername", "userName")]
        public async Task CheckInput_ExceptionThrown_ReturnsInternalServerError(string inputValue, string route)
        {
            // Arrange: ���������� ������ ��� �����.
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

            // Act: ���������� ������������ ����
            var response = await client.GetAsync($"/auth/{route}?{route}={inputValue}");

            // Assert: �������� ����������� �����.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // ����, �����������, ��� ����� CheckInput (CheckEmail ��� CheckUserName) ���������� ��������� ��������� (400 BadRequest ��� 204 NoContent) � ����������� �� ����, ���������� �� ������������ � ��������� ��������� (inputValue) � ��������� ���� ���� (route - "email" ��� "userName").
        [Theory]
        [InlineData("newemail@example.com", false, "email")]
        [InlineData("existingemail@example.com", true, "email")]
        [InlineData("newusername", false, "userName")]
        [InlineData("existingusername", true, "userName")]
        public async Task CheckInput_ReturnsExpectedResult(string inputValue, bool exists, string route)
        {
            // Arrange: ���������� ������ ��� �����.
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

            // Act: ���������� ������������ ����
            var response = await client.GetAsync($"/auth/{route}?{route}={inputValue}");

            // Assert: �������� ����������� �����.
            Assert.Equal(expectedStatusCode, response.StatusCode);
        }

        // ����, �����������, ��� ����� Login ���������� 500 InternalServerError, ���� �� ����� �������������� ������������ ��������� ����������.
        [Fact]
        public async Task Login_ExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange: ���������� ������ ��� �����.
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

            // Act: ���������� ������������ ����
            var response = await client.PostAsync("/auth/login", content);

            // Assert: �������� ����������� �����.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // ����, �����������, ��� ����� Login ���������� 200 OK ��� 400 BadRequest � ����������� �� ����, ���� �� ������� ������ ������� ������.
        [Theory]
        [InlineData("test@example.com", "password")]
        [InlineData("test@example.com", "wrong-password")]
        public async Task Login_ReturnsOkOrBadRequest(string email, string password)
        {
            // Arrange: ���������� ������ ��� �����.
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

            // Act: ���������� ������������ ����
            var response = await client.PostAsync("/auth/login", content);

            // Assert: �������� ����������� �����.
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

        // ����, �����������, ��� ����� Logout ���������� 204 NoContent � ������� cookie �������������� ��� �������� ������ ������������ �� �������.
        [Fact]
        public async Task Logout_SuccessfulLogout_ReturnsNoContentAndDeletesCookie()
        {
            // Arrange: ���������� ������ ��� �����.
            var userName = "testuser";

            var client = _factory.CreateClient();

            client.DefaultRequestHeaders.Add("Cookie", "secretCookie=test_token");

            // Act: ���������� ������������ ����
            var response = await client.PostAsync($"/auth/logout/{userName}", null);

            // Assert: �������� ����������� �����.
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            Assert.True(response.Headers.TryGetValues("Set-Cookie", out var cookieValues));
            Assert.Contains(cookieValues, cookie => cookie.StartsWith("secretCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT;"));
        }

        // ����, �����������, ��� ����� Register ���������� 500 InternalServerError, ���� �� ����� ����������� ������������ ��������� ����������.
        [Fact]
        public async Task Register_ExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange: ���������� ������ ��� �����.
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

            // Act: ���������� ������������ ����
            var response = await client.PostAsync("/auth/register", content);

            // Assert: �������� ����������� �����.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // ����, �����������, ��� ����� Register ���������� 400 BadRequest, ���� � ������� �� ����������� �������� ���������� ������ (������ email, username, password).
        [Fact]
        public async Task Register_InvalidData_ReturnsBadRequest()
        {
            // Arrange: ���������� ������ ��� �����.
            var client = _factory.CreateClient();

            var registerRequest = new CreateUserRequest("", "", "", "", "", "", "");
            var json = JsonConvert.SerializeObject(registerRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: ���������� ������������ ����
            var response = await client.PostAsync("/auth/register", content);

            // Assert: �������� ����������� �����.
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        // ����, �����������, ��� ����� Register ���������� 201 Created ��� �������� ����������� ������ ������������.
        [Fact]
        public async Task Register_SuccessfulRegistration_ReturnsCreated()
        {
            // Arrange: ���������� ������ ��� �����.
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

            // Act: ���������� ������������ ����
            var response = await client.PostAsync("/auth/register", content);

            // Assert: �������� ����������� �����.
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        // ����, �����������, ��� ����� Verify ���������� 500 InternalServerError, ���� �� ����� �������� ������� ������ ��������� ����������.
        [Fact]
        public async Task Verify_ExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange: ���������� ������ ��� �����.
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

            // Act: ���������� ������������ ����
            var response = await client.PostAsync("/auth/verify", content);

            // Assert: �������� ����������� �����.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // ����, �����������, ��� ����� Verify ���������� 400 BadRequest, ���� � ������� �� �������� ������� ������ �������� ���������� ������ (������ email, password).
        [Fact]
        public async Task Verify_InvalidData_ReturnsBadRequest()
        {
            // Arrange: ���������� ������ ��� �����.
            var client = _factory.CreateClient();

            var loginRequest = new LoginUserRequest("", "");
            var json = JsonConvert.SerializeObject(loginRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: ���������� ������������ ����
            var response = await client.PostAsync("/auth/verify", content);

            // Assert: �������� ����������� �����.
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        // ����, �����������, ��� ����� Verify ���������� 204 NoContent ��� �������� �������� ������� ������ ������������.
        [Fact]
        public async Task Verify_SuccessfulVerification_ReturnsNoContent()
        {
            // Arrange: ���������� ������ ��� �����.
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

            // Act: ���������� ������������ ����
            var response = await client.PostAsync("/auth/verify", content);

            // Assert: �������� ����������� �����.
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        // ����, �����������, ��� ����� Verify ���������� 401 Unauthorized, ���� �������� ������� ������ �� ������� (�������� email ��� ������).
        [Fact]
        public async Task Verify_Unauthorized_ReturnsUnauthorized()
        {
            // Arrange: ���������� ������ ��� �����.
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

            // Act: ���������� ������������ ����
            var response = await client.PostAsync("/auth/verify", content);

            // Assert: �������� ����������� �����.
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}