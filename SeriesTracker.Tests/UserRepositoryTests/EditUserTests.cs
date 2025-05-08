using Microsoft.EntityFrameworkCore;
using Xunit;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    //  [Collection("Sequential")]: Атрибут, указывающий, что этот класс тестов входит в коллекцию "Sequential", что обеспечивает последовательное выполнение тестов.
    [Collection("Sequential")]
    public class EditUserTests : IClassFixture<UserRepositoryTestsBase>, IDisposable
    {
        //  _fixture: Экземпляр UserRepositoryTestsBase, предоставляющий доступ к UserRepository и DbContext.
        private readonly UserRepositoryTestsBase _fixture;

        public EditUserTests(UserRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        //  ChangeUserRole_ExistingRole_ChangesUserRoleAndReturnsTrue: Тест, проверяющий, что метод ChangeUserRole успешно изменяет роль пользователя и возвращает true, если роль существует.
        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        public async Task ChangeUserRole_ExistingRole_ChangesUserRoleAndReturnsTrue(int roleId)
        {
            //  Arrange: Подготовка данных для теста.
            var role = await _fixture._context.RoleEntities.FindAsync(roleId);
            Assert.NotNull(role);

            var user = await _fixture._context.UserEntities.Include(u => u.Roles).FirstAsync();

            //  Act: Выполнение тестируемого кода.
            bool result = await _fixture._userRepository.ChangeUserRole(user.Id, roleId);

            //  Assert: Проверка результатов теста.
            Assert.True(result);

            var updatedUser = await _fixture._context.UserEntities.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == user.Id);

            Assert.NotNull(updatedUser);
            Assert.Equal(roleId, updatedUser.Roles.First().Id);
        }

        //  ChangeUserRole_NonExistingRole_ReturnsFalse: Тест, проверяющий, что метод ChangeUserRole возвращает false, если роль не существует.
        [Fact]
        public async Task ChangeUserRole_NonExistingRole_ReturnsFalse()
        {
            //  Arrange: Подготовка данных для теста.
            var nonExistingRoleId = 999;
            var user = await _fixture._context.UserEntities.FirstAsync();

            //  Act: Выполнение тестируемого кода.
            bool result = await _fixture._userRepository.ChangeUserRole(user.Id, nonExistingRoleId);

            //  Assert: Проверка результатов теста.
            Assert.False(result);
        }

        //  UpdateUser_ExistingUser_UpdatesPropertiesAndReturnsTrue: Тест, проверяющий, что метод UpdateUser успешно обновляет свойства пользователя и возвращает true, если пользователь существует.
        [Fact]
        public async Task UpdateUser_ExistingUser_UpdatesPropertiesAndReturnsTrue()
        {
            //  Arrange: Подготовка данных для теста.
            var existingUser = _fixture._context.UserEntities.First();

            //  Act: Выполнение тестируемого кода.
            bool result = await _fixture._userRepository.UpdateUser(existingUser.Id, "updateduser", null, null, "updated@example.com", null, null, null);

            //  Assert: Проверка результатов теста.
            Assert.True(result);

            var updatedUser = await _fixture._context.UserEntities.FindAsync(existingUser.Id);

            Assert.NotNull(updatedUser);
            Assert.Equal("updateduser", updatedUser.UserName);
            Assert.Equal("updated@example.com", updatedUser.Email);
        }

        //  UpdateUser_NonExistingUser_ReturnsFalse: Тест, проверяющий, что метод UpdateUser возвращает false, если пользователь не существует.
        [Fact]
        public async Task UpdateUser_NonExistingUser_ReturnsFalse()
        {
            //  Arrange: Подготовка данных для теста.
            var nonExistingUserId = Guid.NewGuid();

            //  Act: Выполнение тестируемого кода.
            bool result = await _fixture._userRepository.UpdateUser(nonExistingUserId, "newuser", null, null, "new@example.com", null, null, null);

            //  Assert: Проверка результатов теста.
            Assert.False(result);
        }

        //  UpdateUser_ExistingUser_NullProperties_UpdatesUserName: Тест, проверяющий, что метод UpdateUser с null свойствами обновляет UserName пользователя.
        [Fact]
        public async Task UpdateUser_ExistingUser_NullProperties_UpdatesUserName()
        {
            //  Arrange: Подготовка данных для теста.
            var existingUser = _fixture._context.UserEntities.First();

            //  Act: Выполнение тестируемого кода.
            bool result = await _fixture._userRepository.UpdateUser(existingUser.Id, null, null, null, null, null, null, null);

            //  Assert: Проверка результатов теста.
            Assert.True(result);

            var updatedUser = await _fixture._context.UserEntities.FindAsync(existingUser.Id);
            Assert.NotNull(updatedUser);
            Assert.Equal(existingUser.UserName, updatedUser.UserName);
        }

        //  Dispose: Метод, освобождающий ресурсы после выполнения тестов.
        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}