using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Exceptions;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;
using Xunit;

namespace SeriesTracker.Tests.ServicesTests
{
    public class UserSeriesServiceTests
    {
        private readonly Mock<ILogger<UserSeriesService>> _mockLogger;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<IUserSeriesRepository> _mockUserSeriesRepository;

        private readonly UserSeriesService _userSeriesService;

        public UserSeriesServiceTests()
        {
            _mockLogger = new Mock<ILogger<UserSeriesService>>();
            _mockMapper = new Mock<IMapper>();
            _mockUserRepository = new Mock<IUserRepository>();
            _mockUserSeriesRepository = new Mock<IUserSeriesRepository>();

            _userSeriesService = new UserSeriesService(_mockUserSeriesRepository.Object, _mockUserRepository.Object, _mockLogger.Object, _mockMapper.Object);
        }

        // Тест, проверяющий, что метод CreateSeries успешно создает запись и возвращает корректный Guid идентификатор созданной записи.
        [Fact]
        public async Task CreateSeries_ReturnsGuid()
        {
            // Arrange: Подготовка данных для теста.: Подготовка данных для теста.
            var dateNow = DateTime.UtcNow.ToString("s");
            var seriesId = Guid.NewGuid();

            var userSeries = UserSeries.Create
                (
                    seriesId,
                    999,
                    Guid.NewGuid(),
                    3,
                    12,
                    dateNow,
                    dateNow,
                    false
            );

            _mockUserSeriesRepository.Setup(repo => repo.Add(It.IsAny<UserSeries>())).ReturnsAsync(seriesId);

            // Act: Выполнение тестируемого кода.
            Guid createdSeriesId = await _userSeriesService.Create(
                userSeries.Id,
                userSeries.UserId,
                userSeries.AnimeId,
                userSeries.CategoryId,
                userSeries.WatchedEpisodes,
                userSeries.IsFavorite);

            //  Assert: Проверка результатов теста.
            Assert.Equal(seriesId, createdSeriesId);

            // Убедимся, что метод Add был вызван.
            _mockUserSeriesRepository.Verify(repo => repo.Add(It.IsAny<UserSeries>()), Times.Once);
        }

        // Тест, проверяющий, что метод DeleteAllSeriesByUser удаляет все записи для определенного пользователя и возвращает ожидаемый результат (true в случае успеха, false в случае неудачи).
        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public async Task DeleteAllSeriesByUser_ReturnsExpectedResult(bool expectedResult)
        {
            // Arrange: Подготовка данных для теста.: Подготовка данных для теста.
            Guid userId = Guid.NewGuid();

            _mockUserSeriesRepository.Setup(repo => repo.DeleteAllSeriesByUserId(userId)).ReturnsAsync(expectedResult);

            // Act: Выполнение тестируемого кода.
            bool result = await _userSeriesService.DeleteAllSeries(userId);

            //  Assert: Проверка результатов теста.
            Assert.Equal(expectedResult, result);
        }

        // Тест, проверяющий, что метод DeleteSeries удаляет конкретную запись и возвращает ожидаемый результат (true в случае успеха, false в случае неудачи).
        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public async Task DeleteSeries_ReturnsExpectedResult(bool expectedResult)
        {
            // Arrange: Подготовка данных для теста.: Подготовка данных для теста.
            Guid userId = Guid.NewGuid();

            _mockUserSeriesRepository.Setup(repo => repo.DeleteSeriesById(userId)).ReturnsAsync(expectedResult);

            // Act: Выполнение тестируемого кода.
            bool result = await _userSeriesService.DeleteSeries(userId);

            //  Assert: Проверка результатов теста.
            Assert.Equal(expectedResult, result);
        }

        // Тест, проверяющий, что метод GetGroupShortSeries возвращает список сгруппированных данных.
        [Fact]
        public async Task GetGroupShortSeries_ReturnsList()
        {
            // Arrange: Подготовка данных для теста.: Подготовка данных для теста.
            string userName = "userName";
            _mockUserSeriesRepository.Setup(repo => repo.GetGroupShortSeries(userName)).ReturnsAsync([]);

            // Act: Выполнение тестируемого кода.
            var result = await _userSeriesService.GetGroupShortSeries(userName);

            //  Assert: Проверка результатов теста.
            Assert.Empty(result);
            _mockUserSeriesRepository.Verify(repo => repo.GetGroupShortSeries(userName), Times.Once);
        }

        // Тест, проверяющий, что метод GetUserProfile успешно получает профиль пользователя, если пользователь существует и возвращает UserActivityDto с заполненными данными профиля.
        [Fact]
        public async Task GetUserProfile_UserExistsAndProfileFound_ReturnsUserActivityDto()
        {
            // Arrange: Подготовка данных для теста.
            string userName = "username";
            var user = User.Create(
                Guid.NewGuid(),
                userName,
                "email",
                "password",
                "name",
                "surname",
                "avatar",
                "datebirth",
                "regDate"
                );
            SeriesProfileDTO seriesProfile = new();
            var userActivityDto = new UserActivityDTO { UserName = user.UserName, Email = user.Email, RegDate = user.RegDate };

            _mockUserRepository.Setup(repo => repo.GetUserByUserName(userName)).ReturnsAsync(user);
            _mockUserSeriesRepository.Setup(repo => repo.GetUserProfile(user.Id)).ReturnsAsync(seriesProfile);
            _mockMapper.Setup(mapper => mapper.Map(user, It.IsAny<Action<IMappingOperationOptions<object, UserActivityDTO>>>()))
                .Returns(userActivityDto);

            // Act: Выполнение тестируемого кода.
            UserActivityDTO? result = await _userSeriesService.GetUserProfile(userName);

            //  Assert: Проверка результатов теста.
            Assert.NotNull(result);
            Assert.Equal(userActivityDto, result);
        }

        // Тест, проверяющий, что метод GetUserSeriesList выбрасывает исключение NotFoundException, если пользователь с указанным именем не существует.
        [Fact]
        public async Task GetUserSeriesList_UserDoesNotExist_ThrowsNotFoundException()
        {
            // Arrange: Подготовка данных для теста.
            string userName = "nonexistentuser";
            _mockUserRepository.Setup(repo => repo.GetUserByUserName(userName)).ReturnsAsync(null as User);

            // Act: Выполнение тестируемого кода. & Assert: Проверка результатов теста.
            await Assert.ThrowsAsync<NotFoundException>(() => _userSeriesService.GetUserSeriesList(userName, 1, 3, false));
        }

        // Тест, проверяющий, что метод GetUserSeriesList возвращает пустой массив, если пользователь существует, но у него нет аниме.
        [Fact]
        public async Task GetUserSeriesList_UserExistsAnimeIdsEmpty_ReturnsEmptyArray()
        {
            // Arrange: Подготовка данных для теста.
            string userName = "testuser";
            var userId = Guid.NewGuid();
            var user = User.Create(
                Guid.NewGuid(),
                userName,
                "email",
                "password",
                "name",
                "surname",
                "avatar",
                "datebirth",
                "regDate"
                );
            int page = 1;
            int categoryId = 3;
            bool isFavorite = false;
            _mockUserRepository.Setup(repo => repo.GetUserByUserName(userName)).ReturnsAsync(user);
            _mockUserSeriesRepository.Setup(repo => repo.GetAnimeIdsList(userId, page, categoryId, isFavorite)).ReturnsAsync([]);

            // Act: Выполнение тестируемого кода.
            ShikimoriAnime[] result = await _userSeriesService.GetUserSeriesList(userName, page, categoryId, isFavorite);

            //  Assert: Проверка результатов теста.
            Assert.Empty(result);
        }

        // Тест, проверяющий, что метод GetUserProfile возвращает null, если пользователь с указанным именем не существует.
        [Fact]
        public async Task GetUserProfile_UserDoesNotExist_ReturnsNull()
        {
            // Arrange: Подготовка данных для теста.
            string userName = "nonexistentuser";
            _mockUserRepository.Setup(repo => repo.GetUserByUserName(userName)).ReturnsAsync(null as User);

            // Act: Выполнение тестируемого кода.
            UserActivityDTO? result = await _userSeriesService.GetUserProfile(userName);

            // Assert: Проверка результатов теста.
            Assert.Null(result);
        }

        // Тест, проверяющий, что метод UpdateSeries обновляет запись и возвращает ожидаемый результат (true в случае успеха, false в случае неудачи).
        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public async Task UpdateSeries_ReturnsExpectedResult(bool expectedResult)
        {
            // Arrange: Подготовка данных для теста.: Подготовка данных для теста.
            Guid seriesId = Guid.NewGuid();
            int watchedEpisodes = 0;
            int categoryId = (int)Core.Enums.Category.Смотрю;
            bool isFavorite = true;
            string dateNow = DateTime.UtcNow.ToString("s");

            _mockUserSeriesRepository.Setup(repo => repo.UpdateSeries(seriesId, watchedEpisodes, categoryId, isFavorite, dateNow)).ReturnsAsync(expectedResult);

            // Act: Выполнение тестируемого кода.
            bool result = await _userSeriesService.UpdateSeries(seriesId, watchedEpisodes, categoryId, isFavorite);

            // Assert: Проверка результатов теста.
            Assert.Equal(expectedResult, result);
        }
    }
}