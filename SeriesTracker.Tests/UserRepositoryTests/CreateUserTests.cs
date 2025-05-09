using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Enums;
using SeriesTracker.Core.Models;
using Xunit;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    //  [Collection("Sequential")]: Атрибут, указывающий, что этот класс тестов входит в коллекцию "Sequential", что обеспечивает последовательное выполнение тестов.
    [Collection("Sequential")]
    public class CreateUserTests : IClassFixture<UserRepositoryTestsBase>, IDisposable
    {
        //  _fixture: Экземпляр UserRepositoryTestsBase, предоставляющий доступ к UserRepository и DbContext.
        private readonly UserRepositoryTestsBase _fixture;

        public CreateUserTests(UserRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        // Тест, проверяющий, что метод CreateUser либо успешно создает пользователя и возвращает Guid, либо выбрасывает DbUpdateException, если пользователь с таким Id уже существует.
        [Theory]
        [InlineData("a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b", "newUser", "newuser@mail.com", "Hash-new", "NewName", "NewSurname", "Url", "23-12-1999")]
        [InlineData("b8f8d7d4-2e3c-4c40-9b2e-9f4b1a6b3d2f", "newUser", "newuser@mail.com", "Hash-new", null, null, null, null)]
        public async Task CreateUser_ExistingUser_ReturnsGuid_or_Exception(string id, string userName, string email, string passwordHash, string? name, string? surName, string? avatar, string? dateBirth)
        {
            // Arrange: Подготовка данных для теста.
            // roleEntity: Получаем роль "User" из базы данных.
            var roleEntity = await _fixture._context.RoleEntities.SingleOrDefaultAsync(r => r.Id == (int)Role.User);
            // Проверяем, что роль существует.
            Assert.NotNull(roleEntity);

            // newUserGuid: Преобразуем строковый Id в Guid.
            Guid newUserGuid = Guid.Parse(id);
            // user: Создаем экземпляр User с переданными параметрами.
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

            // Проверяем, какой Id был передан в тест.
            if (id == "a7e7c6c3-1f2b-4b3f-8a1d-8e3a9b5f2c7b")
            {
                // Если Id соответствует существующему пользователю, то ожидаем исключение DbUpdateException.
                await Assert.ThrowsAsync<DbUpdateException>(async () =>
                {
                    // Act: Пытаемся создать пользователя с существующим Id.
                    await _fixture._userRepository.CreateUser(user);
                });
            }
            else
            {
                // Если Id не соответствует существующему пользователю, то выполняем следующие действия:
                Guid resultGuid = await _fixture._userRepository.CreateUser(user);

                // Assert: Проверяем результаты теста.
                Assert.NotEqual(Guid.Empty, resultGuid);

                var createdUser = await _fixture._context.UserEntities.FindAsync(newUserGuid);
                Assert.NotNull(createdUser);
                Assert.Equal(newUserGuid, createdUser.Id);

                // Assert.All: Проверяем, что остальные свойства созданного пользователя соответствуют ожидаемым значениям.
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

        //  Dispose: Метод, освобождающий ресурсы после выполнения тестов.
        public void Dispose()
        {
            foreach (var entry in _fixture._context.ChangeTracker.Entries().ToList())
            {
                entry.State = EntityState.Detached;
            }
            GC.SuppressFinalize(this);
        }
    }
}