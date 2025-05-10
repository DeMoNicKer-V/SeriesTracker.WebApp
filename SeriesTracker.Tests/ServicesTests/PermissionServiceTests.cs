using Moq;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;
using Xunit;

namespace SeriesTracker.Tests.ServicesTests
{
    public class PermissionServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepository;

        private readonly IPermissionSevice _permissionSevice;

        public PermissionServiceTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();

            _permissionSevice = new PermissionService(_mockUserRepository.Object);
        }


        // Тест, проверяющий, что метод GetPermissionsAsync возвращает список разрешений пользователя.
        [Fact]
        public async Task GetPermissionsByUser_ReturnsSetPermissions()
        {
            // Arrange: Подготовка данных для теста.
            Guid userGuid = Guid.NewGuid();
            var permissions = new List<Permission>() { Permission.Update, Permission.Add, Permission.Read }.ToHashSet();

            _mockUserRepository.Setup(repo => repo.GetUserPermissions(userGuid)).ReturnsAsync(permissions);

            // Act: Выполнение тестируемого кода.
            var result = await _permissionSevice.GetPermissionsAsync(userGuid);

            //  Assert: Проверка результатов теста.
            Assert.Equal(permissions, result);
        }
    }
}