using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;
using Xunit;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    //  [Collection("Sequential")]: Атрибут, указывающий, что этот класс тестов входит в коллекцию "Sequential", что обеспечивает последовательное выполнение тестов.
    [Collection("Sequential")]
    public class GetUserTests : IClassFixture<UserRepositoryTestsBase>, IDisposable
    {
        //  _fixture: Экземпляр UserRepositoryTestsBase, предоставляющий доступ к UserRepository и DbContext.
        private readonly UserRepositoryTestsBase _fixture;

        public GetUserTests(UserRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        // Тест, проверяющий, что методы получения пользователя по Id, UserName и Email возвращают пользователя, если он существует.
        [Theory]
        [InlineData("id")]
        [InlineData("username")]
        [InlineData("email")]
        public async Task GetUserBy_ExistingUser_ReturnsUser(string searchBy)
        {
            //  Arrange: Подготовка данных для теста.
            UserEntity expectedUser = _fixture._context.UserEntities.First();

            //  Act: Выполнение тестируемого кода.
            User user;
            switch (searchBy.ToLower())
            {
                case "id":
                    user = await _fixture._userRepository.GetUserById(expectedUser.Id);
                    break;

                case "username":
                    user = await _fixture._userRepository.GetUserByUserName(expectedUser.UserName);
                    break;

                case "email":
                    user = await _fixture._userRepository.GetUserByEmail(expectedUser.Email);
                    break;

                default:
                    throw new ArgumentException("Invalid searchBy value");
            }

            //  Assert: Проверка результатов теста.
            Assert.NotNull(user);
            Assert.Equal(expectedUser.Id, user.Id);
        }

        // Тест, проверяющий, что методы получения пользователя по Id, UserName и Email возвращают null, если пользователь не существует.
        [Theory]
        [InlineData("id", "00000000-0000-0000-0000-000000000000")]
        [InlineData("username", "nonexistinguser")]
        [InlineData("email", "nonexisting@example.com")]
        public async Task GetUserBy_NonExistingUser_ReturnsNull(string searchBy, string searchValue)
        {
            //  Act: Выполнение тестируемого кода.
            User user;
            switch (searchBy.ToLower())
            {
                case "id":
                    user = await _fixture._userRepository.GetUserById(Guid.Parse(searchValue));
                    break;

                case "username":
                    user = await _fixture._userRepository.GetUserByUserName(searchValue);
                    break;

                case "email":
                    user = await _fixture._userRepository.GetUserByEmail(searchValue);
                    break;

                default:
                    throw new ArgumentException("Invalid searchBy value");
            }

            //  Assert: Проверка результатов теста.
            Assert.Null(user);
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