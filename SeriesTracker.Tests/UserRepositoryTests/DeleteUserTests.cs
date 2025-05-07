using SeriesTracker.DataAccess.Entities;
using Xunit;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    public class DeleteUserTests : UserRepositoryTestsBase
    {
        [Fact]
        public async Task DeleteUser_ExistingUser_ReturnsTrue()
        {
            // Arrange
            UserEntity user = _context.UserEntities.First();

            // Act
            bool result = await _userRepository.DeleteUser(user.Id);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteUser_NonExistingUser_ReturnsFalse()
        {
            // Arrange
            var nonExistingUserId = Guid.NewGuid();

            // Act
            bool result = await _userRepository.DeleteUser(nonExistingUserId);

            // Assert
            Assert.False(result);
        }
    }
}