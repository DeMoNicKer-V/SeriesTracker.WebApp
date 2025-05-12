using Microsoft.Extensions.DependencyInjection;
using Moq;
using Newtonsoft.Json;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace SeriesTracker.IntegrationTests
{
    public class CategoryControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly CustomWebApplicationFactory _factory;

        public CategoryControllerIntegrationTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
        }

        // Тест, проверяющий, что метод GetCategoryList возвращает 500 InternalServerError, если во время получения списка категорий возникает исключение.
        [Fact]
        public async Task GetCategoriesList_ExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            var mockCategoryService = new Mock<ICategoryService>();
            mockCategoryService.Setup(service => service.GetCategoryList()).ThrowsAsync(new Exception("Error"));

            var client = CreateTestClient(mockCategoryService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync("/category");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetCategoryList возвращает 200 OK и список категорий, если получение списка категорий прошло успешно.
        [Fact]
        public async Task GetCategoriesList_Successful_ReturnsOkWithCategoryList()
        {
            // Arrange: Подготовка данных для теста.
            var mockCategoryService = new Mock<ICategoryService>();
            List<Core.Models.Category> expectedCategories = [
                Core.Models.Category.Create((int)Core.Enums.Category.Запланировано, Core.Enums.Category.Запланировано.ToString(), "#f7eaf4", null, null),
                Core.Models.Category.Create((int)Core.Enums.Category.Смотрю, Core.Enums.Category.Смотрю.ToString(), "#ca78dc", null, null)
                ];

            mockCategoryService.Setup(service => service.GetCategoryList()).ReturnsAsync(expectedCategories);

            var client = CreateTestClient(mockCategoryService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync("/category");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();

            Assert.Contains(expectedCategories[0].Name, content);
        }

        // Тест, проверяющий, что метод GetCategoryById возвращает 404 NotFound, если указанный ID категории является невалидным (не существует в перечислении Category).
        [Fact]
        public async Task GetCategoryById_InvalidId_ReturnsNotFound()
        {
            // Arrange: Подготовка данных для теста.
            var client = _factory.CreateClient();

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"/category/{999}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetCategoryById возвращает 500 InternalServerError, если во время получения категории по ID возникает непредвиденное исключение.
        [Fact]
        public async Task GetCategoryById_UnexpectedException_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            var mockCategoryService = new Mock<ICategoryService>();
            mockCategoryService.Setup(service => service.GetCategoryById(5)).ThrowsAsync(new Exception("Error"));

            var client = CreateTestClient(mockCategoryService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"/category/{5}");

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод GetCategoryById возвращает 200 OK и категорию с указанным ID, если ID категории является валидным.
        [Theory]
        [InlineData(1)]
        [InlineData(6)]
        public async Task GetCategoryById_ValidId_ReturnsOk(int id)
        {
            // Arrange: Подготовка данных для теста.
            var mockCategoryService = new Mock<ICategoryService>();
            mockCategoryService.Setup(service => service.GetCategoryById(id))
                .ReturnsAsync(Core.Models.Category.Create(id, Enum.GetName(typeof(Core.Enums.Category), id).ToString(), "#f7eaf4", null, null));

            var client = CreateTestClient(mockCategoryService);

            // Act: Выполнение тестируемого кода
            var response = await client.GetAsync($"/category/{id}");

            // Assert: Проверка результатов теста.
            var content = await response.Content.ReadAsStringAsync();
            Assert.Contains(Enum.GetName(typeof(Core.Enums.Category), id).ToString(), content);
        }

        // Тест, проверяющий, что метод UpdateCategoryColor возвращает 500 InternalServerError, если во время обновления цвета категории возникает исключение.
        [Fact]
        public async Task UpdateCategoryColor_ExceptionThrown_ReturnsInternalServerError()
        {
            // Arrange: Подготовка данных для теста.
            int categoryId = 1;
            string newColor = "#FFFFFF";

            var mockCategoryService = new Mock<ICategoryService>();
            mockCategoryService.Setup(service => service.UpdateCategoryColor(categoryId, newColor)).ThrowsAsync(new Exception("Error"));

            var client = CreateTestClient(mockCategoryService);

            var updateRequest = new UpdateCategoryColorRequest(newColor);
            var json = JsonConvert.SerializeObject(updateRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PutAsync($"/category/{categoryId}", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // Тест, проверяющий, что метод UpdateCategoryColor возвращает 404 NotFound, если указанный ID категории является невалидным (не существует в перечислении Category).
        [Fact]
        public async Task UpdateCategoryColor_InvalidCategoryId_ReturnsNotFound()
        {
            // Arrange: Подготовка данных для теста.
            var client = CreateTestClient(null, false);

            var updateRequest = new UpdateCategoryColorRequest("#FFFFFF");
            var json = JsonConvert.SerializeObject(updateRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PutAsync($"/category/{999}", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // Тест, проверяющий, что метод UpdateCategoryColor возвращает 204 NoContent, если обновление цвета категории прошло успешно.
        [Fact]
        public async Task UpdateCategoryColor_SuccessfulUpdate_ReturnsNoContent()
        {
            // Arrange: Подготовка данных для теста.
            int categoryId = 1;
            string newColor = "#FFFFFF";

            var mockCategoryService = new Mock<ICategoryService>();
            mockCategoryService.Setup(service => service.UpdateCategoryColor(categoryId, newColor)).ReturnsAsync(true);

            var client = CreateTestClient(mockCategoryService);

            var updateRequest = new UpdateCategoryColorRequest(newColor);
            var json = JsonConvert.SerializeObject(updateRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act: Выполнение тестируемого кода
            var response = await client.PutAsync($"/category/{categoryId}", content);

            // Assert: Проверка результатов теста.
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        // Метод для создания тестового клиента (с имитацией авторизации)
        private HttpClient CreateTestClient(Mock<ICategoryService>? mock, bool? isBody = true)
        {
            var client = _factory.WithWebHostBuilder(builder =>
            {
                if (isBody == true && mock != null)
                {
                    builder.ConfigureServices(services =>
                    {
                        services.AddScoped(typeof(ICategoryService), (sp) => mock.Object);
                    });
                }
            }).CreateClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Test");

            return client;
        }
    }
}