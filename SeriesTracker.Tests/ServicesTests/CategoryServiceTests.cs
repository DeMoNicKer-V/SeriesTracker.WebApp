using Moq;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using Xunit;

namespace SeriesTracker.Tests.ServicesTests
{
    public class CategoryServiceTests
    {
        private readonly Mock<ICategoryRepository> _mockCategoryRepository;
        private readonly CategoryService _categoryService;

        public CategoryServiceTests()
        {
            _mockCategoryRepository = new Mock<ICategoryRepository>();

            _categoryService = new CategoryService(_mockCategoryRepository.Object);
        }

        [Fact]
        public async Task GetCategoryById_ReturnsCategory()
        {
            // Arrange: Подготовка данных для теста.
            int categoryId = (int)Core.Enums.Category.Отложено;

            Core.Models.Category category = Core.Models.Category.Create(
                categoryId,
                Core.Enums.Category.Отложено.ToString(),
                "#ffffff",
                null,
                DateTime.UtcNow.ToString("s")
                );

            _mockCategoryRepository.Setup(repo => repo.GetCategoryById(categoryId)).ReturnsAsync(category);

            // Act: Выполнение тестируемого кода.

            Core.Models.Category result = await _categoryService.GetCategoryById(categoryId);

            //  Assert: Проверка результатов теста.
            Assert.Equal(category, result);
        }

        [Fact]
        public async Task GetCategoryList_ReturnsCategoryList()
        {
            // Arrange: Подготовка данных для теста.
            List<Core.Models.Category> categories = [];
            int expectedCategoryCount = Enum.GetValues(typeof(Core.Enums.Category)).Length;

            foreach (var value in Enum.GetValues(typeof(Core.Enums.Category)))
            {
                categories.Add(Core.Models.Category.Create(
                (int)value,
                ((Core.Enums.Category)value).ToString(),
                "#ffffff",
                null,
                DateTime.UtcNow.ToString("s")
                ));
            }

            _mockCategoryRepository.Setup(repo => repo.GetCategoryList()).ReturnsAsync(categories);

            // Act: Выполнение тестируемого кода.
            List<Core.Models.Category> result = await _categoryService.GetCategoryList();

            //  Assert: Проверка результатов теста.
            Assert.Equal(expectedCategoryCount, result.Count); // Проверяем, что количество категорий совпадает с ожидаемым.
            Assert.Equal(categories, result); // Проверяем, что возвращаемый список совпадает с ожидаемым.
        }

        [Theory]
        [InlineData((int)Core.Enums.Category.Смотрю, "#46bb32", true)]
        [InlineData(999, "#f12fab", false)]
        public async Task UpdateCategoryColor_CategoryExists_ReturnsTrue(int categoryId, string newColor, bool expectedResult)
        {
            // Arrange: Подготовка данных для теста.
            Core.Models.Category category = Core.Models.Category.Create(
                categoryId,
                Core.Enums.Category.Отложено.ToString(),
                "#ffffff",
                null,
                DateTime.UtcNow.ToString("s")
                );

            _mockCategoryRepository.Setup(repo => repo.GetCategoryById(categoryId)).ReturnsAsync(category);

            // Мы больше не привязываемся к конкретному экземпляру category,
            // а просто говорим, что UpdateCategoryColor должен быть вызван с любым объектом Category.
            _mockCategoryRepository.Setup(repo => repo.UpdateCategoryColor(It.IsAny<Core.Models.Category>())).ReturnsAsync(expectedResult);

            // Act: Выполнение тестируемого кода.
            bool result = await _categoryService.UpdateCategoryColor(categoryId, newColor);

            //  Assert: Проверка результатов теста.
            Assert.Equal(expectedResult, result);
        }
    }
}
