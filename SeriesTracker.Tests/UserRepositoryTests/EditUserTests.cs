using Microsoft.EntityFrameworkCore;
using Xunit;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    [Collection("Sequential")]
    public class EditUserTests : IClassFixture<UserRepositoryTestsBase>, IDisposable
    {
        private readonly UserRepositoryTestsBase _fixture;

        public EditUserTests(UserRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        public async Task ChangeUserRole_ExistingRole_ChangesUserRoleAndReturnsTrue(int roleId)
        {
            // Arrange
            // Убедимся, что роль существует
            var role = await _fixture._context.RoleEntities.FindAsync(roleId);
            Assert.NotNull(role);

            // Получаем пользователя, которому будем менять роль
            var user = await _fixture._context.UserEntities.Include(u => u.Roles).FirstAsync();

            // Act
            bool result = await _fixture._userRepository.ChangeUserRole(user.Id, roleId);

            // Assert
            Assert.True(result);

            var updatedUser = await _fixture._context.UserEntities.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == user.Id);
            Assert.NotNull(updatedUser);
            Assert.Equal(roleId, updatedUser.Roles.First().Id); // Проверяем, что роль изменилась на ожидаемую
        }

        [Fact]
        public async Task ChangeUserRole_NonExistingRole_ReturnsFalse()
        {
            // Arrange
            var nonExistingRoleId = 999; // Предполагаем, что такой роли нет
            var user = await _fixture._context.UserEntities.FirstAsync(); // Получаем пользователя

            // Act
            bool result = await _fixture._userRepository.ChangeUserRole(user.Id, nonExistingRoleId);

            // Assert
            Assert.False(result); // Проверяем, что метод вернул false
        }

        [Fact]
        public async Task UpdateUser_ExistingUser_UpdatesPropertiesAndReturnsTrue()
        {
            // Arrange
            var existingUser = _fixture._context.UserEntities.First();

            // Act
            bool result = await _fixture._userRepository.UpdateUser(existingUser.Id, "updateduser", null, null, "updated@example.com", null, null, null);

            // Assert
            Assert.True(result);

            var updatedUser = await _fixture._context.UserEntities.FindAsync(existingUser.Id);
            Assert.NotNull(updatedUser);
            Assert.Equal("updateduser", updatedUser.UserName);
            Assert.Equal("updated@example.com", updatedUser.Email);
        }

        [Fact]
        public async Task UpdateUser_NonExistingUser_ReturnsFalse()
        {
            // Arrange
            var nonExistingUserId = Guid.NewGuid();

            // Act
            bool result = await _fixture._userRepository.UpdateUser(nonExistingUserId, "newuser", null, null, "new@example.com", null, null, null);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task UpdateUser_ExistingUser_NullProperties_UpdatesUserName()
        {
            // Arrange
            var existingUser = _fixture._context.UserEntities.First();

            // Act
            bool result = await _fixture._userRepository.UpdateUser(existingUser.Id, null, null, null, null, null, null, null);

            // Assert
            Assert.True(result);

            var updatedUser = await _fixture._context.UserEntities.FindAsync(existingUser.Id);
            Assert.NotNull(updatedUser);
            Assert.Equal(existingUser.UserName, updatedUser.UserName);
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}