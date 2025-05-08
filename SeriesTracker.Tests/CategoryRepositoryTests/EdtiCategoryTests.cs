using Xunit;
using Category = SeriesTracker.Core.Enums.Category;

namespace SeriesTracker.Tests.CategoryRepositoryTests
{
    //  [Collection("Sequential")]: Атрибут, указывающий, что этот класс тестов входит в коллекцию "Sequential", что обеспечивает последовательное выполнение тестов.
    [Collection("Sequential")]
    public class EdtiCategoryTests : IClassFixture<CategoryRepositoryTests>, IDisposable
    {
        //  _fixture: Экземпляр CategoryRepositoryTests, предоставляющий доступ к CategoryRepository и DbContext.
        private readonly CategoryRepositoryTests _fixture;

        public EdtiCategoryTests(CategoryRepositoryTests fixture)
        {
            _fixture = fixture;
        }

        // UpdateCategoryColor_ExsistingCategory_ReturnsCategory: Тест, проверяющий, что метод UpdateCategoryColor успешно обновляет цвет существующей категории и возвращает true.
        [Theory]
        [InlineData((int)Category.Запланировано, "#e45c45")]
        [InlineData((int)Category.Смотрю, "#fa22a8")]
        public async Task UpdateCategoryColor_ExsistingCategory_ReturnsCategory(int categoryId, string color)
        {
            // Arrange: Подготовка данных для теста.
            var category = await _fixture._categoryRepository.GetCategoryById(categoryId);
            category.ChangeColor(color);

            // Act: Выполнение тестируемого кода.
            bool isUpdated = await _fixture._categoryRepository.UpdateCategoryColor(category);

            // Assert: Проверка результатов теста.
            Assert.True(isUpdated);

            var updatedCategory = await _fixture._context.CategoryEntities.FindAsync(categoryId);
            Assert.All(new[] {
                new { Actual = updatedCategory.Color, Expected = color },
                new { Actual = updatedCategory.PrevColor, Expected = category.PrevColor },
                new { Actual = updatedCategory.Date, Expected = category.Date },
            }, p => Assert.Equal(p.Expected, p.Actual));
        }

        // GetCategoryById_NonExistingCategory_ReturnsFalse: Тест, проверяющий, что метод UpdateCategoryColor возвращает false, если категория не существует.
        [Fact]
        public async Task GetCategoryById_NonExistingCategory_ReturnsFalse()
        {
            // Arrange: Подготовка данных для теста.
            var category = Core.Models.Category.Create(999, "NonExists", "#ffffff", "", "");

            // Act: Выполнение тестируемого кода.
            bool isUpdated = await _fixture._categoryRepository.UpdateCategoryColor(category);

            // Assert: Проверка результатов теста.
            Assert.False(isUpdated);
        }

        //  Dispose: Метод, освобождающий ресурсы после выполнения тестов.
        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}