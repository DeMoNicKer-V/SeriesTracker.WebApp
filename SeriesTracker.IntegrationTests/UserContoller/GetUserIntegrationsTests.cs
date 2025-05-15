using Moq;
using Newtonsoft.Json;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos;
using System.Net;

namespace SeriesTracker.IntegrationTests.UserContoller
{
    public class GetUserIntegrationsTests(CustomWebApplicationFactory factory) : TestsBase<IUserService>(factory)
    {
        // Тест, проверяющий, что метод GetUserById возвращает 404 NotFound, если пользователь с указанным ID не существует.
        [Fact]
        public async Task GetUserById_ReturnsNotFound()
        {
            // Arrange: Подготовка данных для теста.

            var userId = Guid.Empty;
            var mockUserService = new Mock<IUserService>();
            mockUserService.Setup(service => service.GetUserById(userId)).ReturnsAsync(null as UserDetailDto);

            var client = CreateTestClient(mockUserService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"/user/id/{userId}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetUserById возвращает 500 InternalServerError, если во время получения пользователя по ID возникает необработанное исключение.
        [Fact]
        public async Task GetUserById_UnexpectedException_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserService = new Mock<IUserService>();
            var userId = Guid.NewGuid();
            mockUserService.Setup(service => service.GetUserById(userId)).ThrowsAsync(new Exception("Error"));

            var client = CreateTestClient(mockUserService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"/user/id/{userId}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetUserById возвращает 200 OK и информацию о пользователе, если пользователь с указанным ID существует.
        [Fact]
        public async Task GetUserById_UserExists_ReturnsOK()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserService = new Mock<IUserService>();
            var userId = Guid.NewGuid();
            var testUser = new UserDetailDto { Id = userId, UserName = "username", Email = "email", RegDate = "20-12-1999" };
            mockUserService.Setup(service => service.GetUserById(userId)).ReturnsAsync(testUser);

            var client = CreateTestClient(mockUserService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/user/id/{userId}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();
            Assert.Contains(testUser.UserName, content);
        }

        // Тест, проверяющий, что метод GetUsersList возвращает 200 OK и список пользователей, а также общее количество пользователей для указанной страницы.  Параметр 'page' указывает номер запрашиваемой страницы.
        [Theory]
        [InlineData(1)]
        [InlineData(99)]
        public async Task GetUsersList_ReturnsOK(int page)
        {
            // Arrange: Подготовка данных для теста.
            var userList = new List<UserDto>
        {
            new UserDto { UserName = "user1", Email = "user1@mail.com", RegDate = "20-12-1999" },
            new UserDto { UserName = "user2", Email = "user2@mail.com", RegDate = "20-12-1999" }
        };
            int totalCount = 2; //  Number of users to return

            var mockUserService = new Mock<IUserService>();
            mockUserService.Setup(service => service.GetUserList(page)).ReturnsAsync((userList, totalCount));

            var client = CreateTestClient(mockUserService);

            // Act: Выполнение тестируемого кода.
            var response = await client.GetAsync($"/user/{page}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<UserListResponse>(content);

            Assert.Equal(totalCount, result.TotalCount);
            Assert.Equal(userList.Count, result.Users.Count);
            Assert.Contains(userList[0].UserName, result.Users[0].UserName);
        }

        // Тест, проверяющий, что метод GetUsersList возвращает 500 InternalServerError, если во время получения списка пользователей возникает необработанное исключение.
        [Fact]
        public async Task GetUsersList_UnexpectedException_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserService = new Mock<IUserService>();
            int page = 1;
            mockUserService.Setup(service => service.GetUserList(page)).ThrowsAsync(new Exception("Error"));

            var client = CreateTestClient(mockUserService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"/user/{page}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }
    }

    public class UserListResponse
    {
        public int TotalCount { get; set; }
        public List<UserDto> Users { get; set; } = [];
    }
}