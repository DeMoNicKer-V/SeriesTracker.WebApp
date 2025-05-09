using Microsoft.EntityFrameworkCore;
using Xunit;

namespace SeriesTracker.Tests.CategoryRepositoryTests
{
    //  [Collection("Sequential")]: Атрибут, указывающий, что этот класс тестов входит в коллекцию "Sequential", что обеспечивает последовательное выполнение тестов.
    [Collection("Sequential")]
    public class GetCategoryTests : IClassFixture<CategoryRepositoryTests>, IDisposable
    {
        //  _fixture: Экземпляр CategoryRepositoryTests, предоставляющий доступ к CategoryRepository и DbContext.
        private readonly CategoryRepositoryTests _fixture;

        public GetCategoryTests(CategoryRepositoryTests fixture)
        {
            _fixture = fixture;
        }

        // Тест, проверяющий, что метод GetCategoryById возвращает категорию, если она существует.
        [Theory]
        [InlineData((int)Core.Enums.Category.Запланировано)]
        [InlineData((int)Core.Enums.Category.Смотрю)]
        [InlineData((int)Core.Enums.Category.Просмотрено)]
        [InlineData((int)Core.Enums.Category.Пересматриваю)]
        [InlineData((int)Core.Enums.Category.Отложено)]
        [InlineData((int)Core.Enums.Category.Брошено)]
        public async Task GetCategoryById_ExistingCategory_ReturnsCategory(int categoryId)
        {
            //  Arrange: Подготовка данных для теста.
            var category = await _fixture._categoryRepository.GetCategoryById(categoryId);

            //  Assert: Проверка результатов теста.
            Assert.NotNull(category); 
            Assert.Equal(categoryId, category.Id);
            Assert.Equal(Enum.GetName(typeof(Core.Enums.Category), categoryId), category.Name);
        }

        // Тест, проверяющий, что метод GetCategoryById выбрасывает исключение InvalidOperationException, если категория не существует.
        [Fact]
        public async Task GetCategoryById_NonExistingCategory_ThrowExeption()
        {
            //  Arrange: Подготовка данных для теста.
            int nonExistingCategoryId = 999;

            // Act & Assert: Выполнение тестируемого кода и проверяем результат.
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(async () =>
            {
                await _fixture._categoryRepository.GetCategoryById(nonExistingCategoryId);
            });
        }

        // Тест, проверяющий, что метод GetCategoryList возвращает правильное количество категорий.
        [Fact]
        public async Task GetCategoryList_ExistingCategories_ReturnsCorrectCount()
        {
            //  Arrange: Подготовка данных для теста.
            int expectedCount = Enum.GetValues(typeof(Core.Enums.Category)).Length;

            // Act: Выполнение тестируемого кода.
            var categories = await _fixture._categoryRepository.GetCategoryList();

            // Assert: Провекра результатов теста.
            Assert.NotNull(categories);
            Assert.Equal(expectedCount, categories.Count);
        }

        //  Dispose: Метод, освобождающий ресурсы после выполнения тестов.
        public void Dispose()
        {
            foreach (var entry in _fixture._context.ChangeTracker.Entries().ToList())
            {
                entry.State = EntityState.Detached;
            }
            GC.SuppressFinalize(this);
        }
    }
}