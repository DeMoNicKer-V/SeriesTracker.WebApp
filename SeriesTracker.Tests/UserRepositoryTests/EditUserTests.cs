using Microsoft.EntityFrameworkCore;
using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;
using Xunit;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    public class EditUserTests : UserRepositoryTestsBase
    {
        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        public async Task ChangeUserRole_ExistingRole_ChangesUserRoleAndReturnsTrue(int roleId)
        {
            // Arrange
            // Убедимся, что роль существует
            var role = await _context.RoleEntities.FindAsync(roleId);
            Assert.NotNull(role); 

            // Получаем пользователя, которому будем менять роль
            var user = await _context.UserEntities.Include(u => u.Roles).FirstAsync(); 
            var initialRoleId = user.Roles.Any() ? user.Roles.First().Id : 0;

            // Act
            bool result = await _userRepository.ChangeUserRole(user.Id, roleId);

            // Assert
            Assert.True(result);

            var updatedUser = await _context.UserEntities.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == user.Id);
            Assert.NotNull(updatedUser);
            Assert.Equal(roleId, updatedUser.Roles.First().Id); // Проверяем, что роль изменилась на ожидаемую
        }

        [Fact]
        public async Task ChangeUserRole_NonExistingRole_ReturnsFalse()
        {
            // Arrange
            var nonExistingRoleId = 999; // Предполагаем, что такой роли нет
            var user = await _context.UserEntities.FirstAsync(); // Получаем пользователя

            // Act
            bool result = await _userRepository.ChangeUserRole(user.Id, nonExistingRoleId);

            // Assert
            Assert.False(result); // Проверяем, что метод вернул false
        }
    }
}
