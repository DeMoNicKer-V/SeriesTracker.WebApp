using Microsoft.AspNetCore.Mvc.Testing;
using Moq;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos;
using System.Net;

namespace SeriesTracker.IntegrationTests.UserContoller
{
    public class DeleteUserIntegrationTests(CustomWebApplicationFactory factory) : TestsBase<IUserService>(factory)
    {
        // Тест, проверяющий, что метод DeleteUserByUserName возвращает 204 NoContent, если удаление пользователя прошло успешно и у пользователя есть необходимые права.
        [Theory]
        [InlineData("delete")]
        [InlineData("deleteSelf")]
        public async Task DeleteUserByUserName_SuccessfulDeletion_ReturnsNoContent(string route)
        {
            // Arrange: Подготовка данных для теста.
            string userName = "existingUser";
            Guid userId = Guid.NewGuid();

            var existingUser = new UserDetailDto
            {
                Id = userId,
                UserName = userName,
                Email = "old@email.com",
                Name = "OldName",
                SurName = "OldSurname",
                Avatar = "old_avatar.jpg",
                DateBirth = "1990-01-01",
                RegDate = "2023-01-01"
            };

            var mockUserService = new Mock<IUserService>();

            mockUserService.Setup(service => service.GetUserByUserName(userName))
                .ReturnsAsync(existingUser);
            mockUserService.Setup(service => service.DeleteUser(userId)).ReturnsAsync(true);

            var client = CreateTestClient(mockUserService);

            // Act: Выполнение тестируемого кода.
            var response = await client.DeleteAsync($"/user/{userName}/{route}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            Assert.True(response.Headers.TryGetValues("Set-Cookie", out var cookieValues));
            Assert.Contains(cookieValues, cookie => cookie.StartsWith("secretCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT;"));
        }

        // Тест, проверяющий, что метод DeleteUserByUserName возвращает 500 InternalServerError, если во время удаления пользователя возникает необработанное исключение.
        [Theory]
        [InlineData("delete")]
        [InlineData("deleteSelf")]
        public async Task DeleteUserByUserName_UnexpectedException_ReturnsInternalServerError(string route)
        {
            // Arrange: Подготовка данных для теста.
            string userName = "existingUser";
            Guid userId = Guid.NewGuid();

            var existingUser = new UserDetailDto
            {
                Id = userId,
                UserName = userName,
                Email = "old@email.com",
                Name = "OldName",
                SurName = "OldSurname",
                Avatar = "old_avatar.jpg",
                DateBirth = "1990-01-01",
                RegDate = "2023-01-01"
            };

            var mockUserService = new Mock<IUserService>();

            mockUserService.Setup(service => service.GetUserByUserName(userName))
                .ReturnsAsync(existingUser);
            mockUserService.Setup(service => service.DeleteUser(userId)).ThrowsAsync(new Exception("Error"));

            var client = CreateTestClient(mockUserService);

            // Act: Выполнение тестируемого кода.
            var response = await client.DeleteAsync($"/user/{userName}/{route}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод DeleteUserByUserName возвращает 404 NotFound, если пользователь с указанным именем не найден.
        [Theory]
        [InlineData("delete")]
        [InlineData("deleteSelf")]
        public async Task DeleteUserByUserName_UserNotFound_ReturnsNotFound(string route)
        {
            // Arrange: Подготовка данных для теста.
            string userName = "existingUser";
            Guid userId = Guid.Empty;

            var mockUserService = new Mock<IUserService>();

            mockUserService.Setup(service => service.GetUserByUserName(userName))
                .ReturnsAsync(null as UserDetailDto);
            mockUserService.Setup(service => service.DeleteUser(userId)).ReturnsAsync(true);

            var client = CreateTestClient(mockUserService);

            // Act: Выполнение тестируемого кода.
            var response = await client.DeleteAsync($"/user/{userName}/{route}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}