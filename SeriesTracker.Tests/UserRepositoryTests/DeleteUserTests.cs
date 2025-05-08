using SeriesTracker.DataAccess.Entities;
using Xunit;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    [Collection("Sequential")]
    public class DeleteUserTests : IClassFixture<UserRepositoryTestsBase>, IDisposable
    {
        private readonly UserRepositoryTestsBase _fixture;

        public DeleteUserTests(UserRepositoryTestsBase fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task DeleteUser_ExistingUser_ReturnsTrue()
        {
            // Arrange
            UserEntity user = _fixture._context.UserEntities.First();

            // Act
            bool result = await _fixture._userRepository.DeleteUser(user.Id);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteUser_NonExistingUser_ReturnsFalse()
        {
            // Arrange
            var nonExistingUserId = Guid.NewGuid();

            // Act
            bool result = await _fixture._userRepository.DeleteUser(nonExistingUserId);

            // Assert
            Assert.False(result);
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}