using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.API.Extensions;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Infrastructure.Authentication;

namespace SeriesTracker.API.Controllers
{
    /// <summary>
    /// Контроллер для работы с категориями.
    /// Предоставляет методы для получения информации о категориях и их обновления.
    /// </summary>
    [ApiController]
    [Route("category")] // Атрибут, определяющий маршрут для контроллера
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<CategoryController> _logger;

        /// <summary>
        /// Инициализирует новый экземпляр класса <see cref="CategoryController"/>.
        /// </summary>
        /// <param name="categoryService">Сервис для работы с категориями.</param>
        /// <param name="logger">Логгер для записи информации о работе контроллера.</param>
        public CategoryController(ICategoryService categoryService, ILogger<CategoryController> logger)
        {
            // Внедряем зависимость (Dependency Injection) сервиса категорий и проверяем на null.
            _categoryService = categoryService ?? throw new ArgumentNullException(nameof(categoryService));

            // Внедряем зависимость (Dependency Injection) логгера и проверяем на null.
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Получает категорию по ее идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор категории.</param>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK с категорией с заданным id,
        /// 404 No Found, если такой категории не существует,
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet("{id:int}")]
        public async Task<IResult> GetCategoryById(int id)
        {
            // Проверяем, что идентификатор категории является допустимым значением перечисления Category
            if (!Enum.IsDefined(typeof(Category), id))
            {
                // Логируем предупреждение о неверном идентификаторе категории и возвращаем 404 No Found
                return _logger.NotFoundResponse($"Category with ID: {id} not found");
            }

            try
            {
                // Получаем категорию из сервиса
                var category = await _categoryService.GetCategoryById(id);

                // Возвращаем категории с кодом 200 OK
                return Results.Ok(category);
            }
            catch (InvalidOperationException ex)
            {
                // Логируем ошибку, если категория не найдена в базе данных, и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, $"Category with ID {id} not found in the database.");
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, $"An unexpected error occurred while getting category with ID: {id}");
            }
        }

        /// <summary>
        /// Получает список всех категорий.
        /// </summary>
        /// <returns>Результат выполнения запроса. Возвращает 200 OK со списком всех категорий
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [HttpGet]
        public async Task<IResult> GetCategoryList()
        {
            try
            {
                // Получаем список категорий из сервиса
                var categoryList = await _categoryService.GetCategoryList();

                // Возвращаем список категорий с кодом 200 OK
                return Results.Ok(categoryList);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, "An unexpected error occurred while getting all categories");
            }
        }

        /// <summary>
        /// Обновляет цвет категории.
        /// </summary>
        /// <param name="id">Идентификатор категории.</param>
        /// <param name="request">Запрос на обновление цвета категории.</param>
        /// <returns>Результат выполнения запроса. Возвращает 204 No Content в случае успеха,
        /// 404 No Found, если такой категории не существует,
        /// или 500 Internal Server Error в случае непредвиденной ошибки.</returns>
        [RequirePermission(Permission.Delete)] // Атрибут, указывающий, что для доступа к методу требуется разрешение 'Delete'
        [HttpPut("{id:int}")]
        public async Task<IResult> UpdateCategoryColor(int id, [FromBody] UpdateCategoryColorRequest request)
        {
            // Проверяем, что идентификатор категории является допустимым значением перечисления Category
            if (!Enum.IsDefined(typeof(Category), id))
            {
                // Логируем предупреждение о неверном идентификаторе категории и возвращаем 404 No Found
                return _logger.NotFoundResponse($"Category with ID: {id} not found");
            }

            try
            {
                // Обновляем цвет категории в сервисе
                bool isUpdated = await _categoryService.UpdateCategoryColor(id, request.Color);

                // Если обновление не произошло - выбрасываем исключение
                if (isUpdated == false)
                {
                    throw new Exception($"Failed to update category: ({id}).");
                }

                // Логируем информацию об успешном обновлении цвета категории и возвращаем 204 No Content
                return _logger.NoContentResponse($"Category ({id}) color was updated successfully");
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем 500 Internal Server Error
                return _logger.InternalServerError(ex, $"An unexpected error occurred while updating category color for ID: {id}");
            }
        }
    }
}