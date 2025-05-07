using SeriesTracker.Core.Models;
using SeriesTracker.DataAccess.Entities;
using Xunit;

namespace SeriesTracker.Tests.UserRepositoryTests
{
    public class GetUserTests : UserRepositoryTestsBase
    {
        [Theory]
        [InlineData("id")]
        [InlineData("username")]
        [InlineData("email")]
        public async Task GetUserBy_ExistingUser_ReturnsUser(string searchBy)
        {
            // Arrange
            UserEntity expectedUser = _context.UserEntities.First();

            // Act
            User user;
            switch (searchBy.ToLower())
            {
                case "id":
                    user = await _userRepository.GetUserById(expectedUser.Id);
                    break;

                case "username":
                    user = await _userRepository.GetUserByUserName(expectedUser.UserName);
                    break;

                case "email":
                    user = await _userRepository.GetUserByEmail(expectedUser.Email);
                    break;

                default:
                    throw new ArgumentException("Invalid searchBy value");
            }

            // Assert
            Assert.NotNull(user);
            Assert.Equal(expectedUser.Id, user.Id);
        }

        [Theory]
        [InlineData("id", "00000000-0000-0000-0000-000000000000")]
        [InlineData("username", "nonexistinguser")]
        [InlineData("email", "nonexisting@example.com")]
        public async Task GetUserBy_NonExistingUser_ReturnsNull(string searchBy, string searchValue)
        {
            // Act
            User user;
            switch (searchBy.ToLower())
            {
                case "id":
                    user = await _userRepository.GetUserById(Guid.Parse(searchValue));
                    break;

                case "username":
                    user = await _userRepository.GetUserByUserName(searchValue);
                    break;

                case "email":
                    user = await _userRepository.GetUserByEmail(searchValue);
                    break;

                default:
                    throw new ArgumentException("Invalid searchBy value");
            }

            // Assert
            Assert.Null(user);
        }
    }
}