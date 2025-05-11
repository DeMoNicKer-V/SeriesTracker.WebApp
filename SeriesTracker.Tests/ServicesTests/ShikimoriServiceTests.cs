using AutoMapper;
using GraphQL;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using SeriesTracker.Application;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Dtos;
using SeriesTracker.Core.Models;
using SeriesTracker.Core.Models.Shikimori;
using Xunit;

namespace SeriesTracker.Tests.ServicesTests
{
    public class ShikimoriServiceTests
    {
        private readonly ILogger<ShikimoriService> _logger;
        private readonly Mock<IGraphQLHelper> _mockGraphQLHelper;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<IUserSeriesRepository> _mockUserSeriesRepository;
        private readonly ShikimoriService _shikimoriService;

        public ShikimoriServiceTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _logger = NullLogger<ShikimoriService>.Instance;
            _mockMapper = new Mock<IMapper>();
            _mockUserSeriesRepository = new Mock<IUserSeriesRepository>();
            _mockGraphQLHelper = new Mock<IGraphQLHelper>();

            _shikimoriService = new ShikimoriService(_mockUserSeriesRepository.Object, _logger, _mockMapper.Object, _mockUserRepository.Object, _mockGraphQLHelper.Object);
        }

        [Fact]
        public async Task GetAnimeById_GraphQLHelperThrowsException_ThrowsException()
        {
            // Arrange
            Guid userId = Guid.NewGuid();
            string animeId = "123";

            // Настраиваем Mock-объекты
            _mockGraphQLHelper.Setup(helper => helper.ExecuteGraphQLRequest<ShikimoriAnimeList<ShikimoriAnimeFullDto>>(It.IsAny<GraphQLRequest>(), _logger))
                .ThrowsAsync(new Exception("GraphQL error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _shikimoriService.GetAnimeById(userId, animeId));
        }

        [Fact]
        public async Task GetAnimesByAllParams_GraphQLHelperThrowsException_ThrowsException()
        {
            // Arrange
            Guid userId = Guid.NewGuid();
            int page = 1;
            string name = "anime name";
            string season = "summer 2023";
            string status = "ongoing";
            string kind = "tv";
            string genre = "action";
            string order = "popularity";
            bool censored = true;

            // Настраиваем Mock-объекты
            _mockGraphQLHelper.Setup(helper => helper.ExecuteGraphQLRequest<ShikimoriAnimeList<ShikimoriAnimeDto>>(It.IsAny<GraphQLRequest>(), _logger))
                .ThrowsAsync(new Exception("GraphQL error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _shikimoriService.GetAnimesByAllParams(userId, page, name, season, status, kind, genre, order, censored));
        }

        [Fact]
        public async Task GetAnimesByName_GraphQLHelperThrowsException_ThrowsException()
        {
            // Arrange
            Guid userId = Guid.NewGuid();
            string animeName = "anime name";

            // Настраиваем Mock-объекты
            _mockGraphQLHelper.Setup(helper => helper.ExecuteGraphQLRequest<ShikimoriAnimeList<ShikimoriAnimeDto>>(It.IsAny<GraphQLRequest>(), _logger))
                .ThrowsAsync(new Exception("GraphQL error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _shikimoriService.GetAnimesByName(userId, animeName));
        }

        [Fact]
        public async Task GetGenres_ValidData_ReturnsGenreList()
        {
            // Arrange
            var expectedGenres = new GenreList { Genres = [new Genre { Id = 1, Kind = "genre", Russian = "Комедия" }, new Genre { Id = 2, Kind = "genre", Russian = "Романтика" }] };

            _mockGraphQLHelper.Setup(helper => helper.ExecuteGraphQLRequest<GenreList>(It.IsAny<GraphQLRequest>(), _logger))
                .ReturnsAsync(expectedGenres);

            // Act
            var result = await _shikimoriService.GetGenres();

            // Assert
            Assert.Equal(expectedGenres, result);
            _mockGraphQLHelper.Verify(helper => helper.ExecuteGraphQLRequest<GenreList>(It.IsAny<GraphQLRequest>(), _logger), Times.Once);
        }

        [Fact]
        public async Task GetGroupingGenres_GraphQLHelperReturnsNull_ReturnsNewGenreGroupingDTO()
        {
            // Arrange
            _mockGraphQLHelper.Setup(helper => helper.ExecuteGraphQLRequest<GenreList>(It.IsAny<GraphQLRequest>(), _logger))
                .ReturnsAsync(null as GenreList);

            // Act
            var result = await _shikimoriService.GetGroupingGenres();

            // Assert
            Assert.NotNull(result);
            Assert.IsType<GenreGroupingDTO>(result);
            Assert.Empty(result.Theme);
            Assert.Empty(result.Genre);
            Assert.Empty(result.Demographic);
            _mockGraphQLHelper.Verify(helper => helper.ExecuteGraphQLRequest<GenreList>(It.IsAny<GraphQLRequest>(), _logger), Times.Once);
        }

        [Fact]
        public async Task GetGroupingGenres_ValidData_ReturnsGenreGroupingDTO()
        {
            // Arrange
            var genreList = new GenreList
            {
                Genres = [new Genre { Id = 1, Kind = "genre", Russian = "Комедия" },
                    new Genre { Id = 2, Kind = "genre", Russian = "Романтика" },
                    new Genre { Id = 3, Kind = "theme", Russian = "Киберпанк" },
                    new Genre { Id = 4, Kind = "demographic", Russian = "Сэйнен" }]
            };
            var expectedResult = new GenreGroupingDTO
            {
                Theme = [new Genre { Id = 3, Kind = "theme", Russian = "Киберпанк" }],
                Genre = [new Genre { Id = 1, Kind = "genre", Russian = "Комедия" }, new Genre { Id = 2, Kind = "genre", Russian = "Романтика" }],
                Demographic = [new Genre { Id = 4, Kind = "demographic", Russian = "Сэйнен" }]
            };

            _mockGraphQLHelper.Setup(helper => helper.ExecuteGraphQLRequest<GenreList>(It.IsAny<GraphQLRequest>(), _logger))
                .ReturnsAsync(genreList);

            // Act
            var result = await _shikimoriService.GetGroupingGenres();

            // Assert
            Assert.Equal(expectedResult.Theme.Count, result.Theme.Count);
            Assert.Equal(expectedResult.Genre.Count, result.Genre.Count);
            Assert.Equal(expectedResult.Demographic.Count, result.Demographic.Count);
            _mockGraphQLHelper.Verify(helper => helper.ExecuteGraphQLRequest<GenreList>(It.IsAny<GraphQLRequest>(), _logger), Times.Once);
        }

        [Fact]
        public async Task GetRandomAnime_GraphQLHelperReturnsNull_ReturnsNewShikimoriAnime()
        {
            // Arrange
            _mockGraphQLHelper.Setup(helper => helper.ExecuteGraphQLRequest<ShikimoriAnimeList<ShikimoriAnime>>(It.IsAny<GraphQLRequest>(), _logger))
                .ReturnsAsync(null as ShikimoriAnimeList<ShikimoriAnime>);

            // Act
            var result = await _shikimoriService.GetRandomAnime();

            // Assert
            Assert.NotNull(result); //  Убеждаемся, что объект не null
            Assert.IsType<ShikimoriAnime>(result); // Убеждаемся, что это ShikimoriAnime
            _mockGraphQLHelper.Verify(helper => helper.ExecuteGraphQLRequest<ShikimoriAnimeList<ShikimoriAnime>>(It.IsAny<GraphQLRequest>(), _logger), Times.Once);
        }

        [Fact]
        public async Task GetRandomAnime_ValidData_ReturnsShikimoriAnime()
        {
            // Arrange
            var expectedAnime = new ShikimoriAnime { Id = 1 };
            var animeList = new ShikimoriAnimeList<ShikimoriAnime> { Animes = [new ShikimoriAnime { Id = expectedAnime.Id }] };

            _mockGraphQLHelper.Setup(helper => helper.ExecuteGraphQLRequest<ShikimoriAnimeList<ShikimoriAnime>>(It.IsAny<GraphQLRequest>(), _logger))
                .ReturnsAsync(animeList);

            // Act
            var result = await _shikimoriService.GetRandomAnime();

            // Assert
            Assert.Equal(expectedAnime.Id, result.Id);
            _mockGraphQLHelper.Verify(helper => helper.ExecuteGraphQLRequest<ShikimoriAnimeList<ShikimoriAnime>>(It.IsAny<GraphQLRequest>(), _logger), Times.Once);
        }
        [Fact]
        public async Task GetRecentAnimesByIds_GraphQLHelperThrowsException_ThrowsException()
        {
            // Arrange
            string userName = "testUser";
            string ids = "1,2,3";

            _mockUserRepository.Setup(repo => repo.GetUserByUserName(userName)).ReturnsAsync(null as User);
            _mockGraphQLHelper.Setup(helper => helper.ExecuteGraphQLRequest<ShikimoriAnimeList<ShikimoriAnimeFullDto>>(It.IsAny<GraphQLRequest>(), _logger))
                .ThrowsAsync(new Exception("GraphQL error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _shikimoriService.GetRecentAnimesByIds(userName, ids));
            _mockUserRepository.Verify(repo => repo.GetUserByUserName(userName), Times.Once);
        }
    }
}