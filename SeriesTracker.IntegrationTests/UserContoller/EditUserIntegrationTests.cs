using Microsoft.AspNetCore.Mvc.Testing;
using Moq;
using Newtonsoft.Json;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace SeriesTracker.IntegrationTests.UserContoller
{
    public class EditUserIntegrationTests(CustomWebApplicationFactory factory) : TestsBase<IUserService>(factory)
    {
        // Тест, проверяющий, что метод ChangeUserRole возвращает 204 NoContent, если обновление роли пользователя прошло успешно.
        [Fact]
        public async Task ChangeUserRole_SuccessfulUpdate_ReturnsNoContent()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserService = new Mock<IUserService>();
            Guid userId = Guid.NewGuid();
            int roleId = (int)Role.Moder;
            mockUserService.Setup(service => service.ChangeUserRole(userId, roleId)).ReturnsAsync(true);

            var client = CreateTestClient(mockUserService);

            var json = JsonConvert.SerializeObject(roleId);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода.
            var response = await client.PutAsync($"/user/changeRole/{userId}", content);

            // Assert: Проверка результатов кода.
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetUsersList возвращает 500 InternalServerError, если обновление роли пользователя не произошло возникает необработанное исключение.
        [Fact]
        public async Task ChangeUserRole_UpdateFailed_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            var mockUserService = new Mock<IUserService>();
            Guid userId = Guid.NewGuid();
            int roleId = (int)Role.Moder;
            mockUserService.Setup(service => service.ChangeUserRole(userId, roleId)).ThrowsAsync(new Exception("Error"));

            var client = CreateTestClient(mockUserService);
            var json = JsonConvert.SerializeObject(roleId);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            // Act: Выполнение тестируемого кода.
            var response = await client.PutAsync($"/user/changeRole/{userId}", content);

            // Assert: Проверка результатов кода.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод UpdateUser возвращает 204 NoContent, если обновление пользователя прошло успешно.
        [Fact]
        public async Task UpdateUser_SuccessfulUpdate_ReturnsNoContent()
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

            var updateUserRequest = new CreateUserRequest("updatedUser",
                "NewName",
                "NewSurname",
                "new@email.com",
                "newPassword",
                "new_avatar.jpg",
                "1995-05-05"
            );

            var mockUserService = new Mock<IUserService>();

            mockUserService.Setup(service => service.GetUserByUserName(userName))
                .ReturnsAsync(existingUser);

            mockUserService.Setup(service => service.UpdateUser(
                    userId,
                    updateUserRequest.UserName,
                    updateUserRequest.Name,
                    updateUserRequest.SurName,
                    updateUserRequest.Email,
                    updateUserRequest.Password,
                    updateUserRequest.Avatar,
                    updateUserRequest.DateBirth))
                .ReturnsAsync(true);

            mockUserService.Setup(service => service.GenerateNewUserToken(updateUserRequest.UserName))
              .ReturnsAsync("newGeneratedToken");

            var client = CreateTestClient(mockUserService);

            var json = JsonConvert.SerializeObject(updateUserRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода.
            var response = await client.PutAsync($"/user/update/{userName}", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            Assert.True(response.Headers.Contains("Set-Cookie"));
            Assert.Contains("secretCookie=newGeneratedToken", response.Headers.GetValues("Set-Cookie").First());
        }

        // Тест, проверяющий, что метод UpdateUser возвращает 500 InternalServerError, если во время обновления пользователя возникает исключение.
        [Fact]
        public async Task UpdateUser_UnexpectedException_ReturnsInternalServerError()
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

            var updateUserRequest = new CreateUserRequest("updatedUser",
                "NewName",
                "NewSurname",
                "new@email.com",
                "newPassword",
                "new_avatar.jpg",
                "1995-05-05"
            );

            var mockUserService = new Mock<IUserService>();

            mockUserService.Setup(service => service.GetUserByUserName(userName))
                .ReturnsAsync(existingUser);

            mockUserService.Setup(service => service.UpdateUser(
                    userId,
                    updateUserRequest.UserName,
                    updateUserRequest.Name,
                    updateUserRequest.SurName,
                    updateUserRequest.Email,
                    updateUserRequest.Password,
                    updateUserRequest.Avatar,
                    updateUserRequest.DateBirth))
                .ReturnsAsync(true);

            mockUserService.Setup(service => service.GenerateNewUserToken(updateUserRequest.UserName))
              .ThrowsAsync(new Exception("Error"));

            var client = CreateTestClient(mockUserService);

            var json = JsonConvert.SerializeObject(updateUserRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода.
            var response = await client.PutAsync($"/user/update/{userName}", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод UpdateUser возвращает 404 NotFound, если пользователь с указанным именем не найден.
        [Fact]
        public async Task UpdateUser_UserNotFound_ReturnsNotFound()
        {
            // Arrange: Подготовка данных для теста.
            string userName = "nonExistingUser";
            Guid userId = Guid.NewGuid();

            var updateUserRequest = new CreateUserRequest("updatedUser",
                "NewName",
                "NewSurname",
                "new@email.com",
                "newPassword",
                "new_avatar.jpg",
                "1995-05-05"
            );

            var mockUserService = new Mock<IUserService>();

            mockUserService.Setup(service => service.GetUserByUserName(userName))
                .ReturnsAsync(null as UserDetailDto);

            mockUserService.Setup(service => service.UpdateUser(
                    userId,
                    updateUserRequest.UserName,
                    updateUserRequest.Name,
                    updateUserRequest.SurName,
                    updateUserRequest.Email,
                    updateUserRequest.Password,
                    updateUserRequest.Avatar,
                    updateUserRequest.DateBirth))
                .ReturnsAsync(true);

            mockUserService.Setup(service => service.GenerateNewUserToken(updateUserRequest.UserName))
              .ReturnsAsync("newGeneratedToken");

            var client = CreateTestClient(mockUserService);

            var json = JsonConvert.SerializeObject(updateUserRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода.
            var response = await client.PutAsync($"/user/update/{userName}", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}