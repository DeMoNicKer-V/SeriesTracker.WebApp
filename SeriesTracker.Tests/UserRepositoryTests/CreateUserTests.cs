using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;
using Xunit;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    [Collection("Sequential")]
    public class CreateUserTests : IClassFixture<UserRepositoryTestsBase>, IDisposable
    {
        private readonly UserRepositoryTestsBase _fixture;

        public CreateUserTests(UserRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        [Theory]
        [InlineData("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b", "newUser", "newuser@mail.com", "Hash-new", "NewName", "NewSurname", "Url", "23-12-1999")]
        [InlineData("b8f8d7d4-2e3c-4c40-9b2e-9f4b1a6b3d8d", "newUser", "newuser@mail.com", "Hash-new", null, null, null, null)]
        public async Task CreateUser_ExistingUser_ReturensGuid(string id, string userName, string email, string passwordHash, string? name, string? surName, string? avatar, string? dateBirth)
        {
            // Arrange
            var roleEntity = await _fixture._context.RoleEntities.SingleOrDefaultAsync(r => r.Id == (int)Role.User);
            Assert.NotNull(roleEntity);

            Guid newUserGuid = Guid.Parse(id);
            var user = User.Create(
                newUserGuid,
                userName,
                email,
                passwordHash,
                name,
                surName,
                avatar,
                dateBirth,
                DateTime.UtcNow.ToString("s")
            );

            if (id == "a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b")
            {
                // Ожидаем исключение при попытке создания пользователя с существующим ID
                await Assert.ThrowsAsync<DbUpdateException>(async () =>  // <--- ПЕРЕМЕСТИЛИ ВЫЗОВ ВНУТРЬ
                {
                    await _fixture._userRepository.CreateUser(user);
                });
            }
            else
            {

                // Act
                Guid resultGuid = await _fixture._userRepository.CreateUser(user);

                // Assert
                Assert.NotEqual(Guid.Empty, resultGuid);

                var createdUser = await _fixture._context.UserEntities.FindAsync(newUserGuid);
                Assert.NotNull(createdUser);
                Assert.Equal(newUserGuid, createdUser.Id);

                Assert.All(new[] {
                new { Actual = createdUser.UserName, Expected = user.UserName },
                new { Actual = createdUser.Email, Expected = user.Email },
                new { Actual = createdUser.Name, Expected = user.Name },
                new { Actual = createdUser.SurName, Expected = user.SurName },
                new { Actual = createdUser.Avatar, Expected = user.Avatar },
                new { Actual = createdUser.DateBirth, Expected = user.DateBirth }
            }, p => Assert.Equal(p.Expected, p.Actual));
            }
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}