using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("category")]
    public class CategoryController(ICategoryService categoryService, ILogger<CategoryController> logger) : ControllerBase
    {
        private readonly ICategoryService _categoryService = categoryService;
        private readonly ILogger<CategoryController> _logger = logger;

        [HttpGet]
        public async Task<IResult> GetCategoryList()
        {
            try
            {
                var categoryList = await _categoryService.GetCategoryList();
                return Results.Ok(categoryList);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while getting all categories");
                return Results.BadRequest(new { ex.Message });
            }
        }


        [HttpGet("{id:int}")]
        public async Task<IResult> GetCategoryById(int id)
        {
            if (!Enum.IsDefined(typeof(Category), id))
            {
                _logger.LogError("Category with ID: {Id} not found", id);
                return Results.NotFound("Category not found");
            }

            try
            {
                var category = await _categoryService.GetCategoryById(id);
                return Results.Ok(category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while getting category with ID: {Id}", id);
                return Results.BadRequest(new { ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IResult> UpdateCategoryColor(int id, [FromBody] UpdateCategoryColorRequest request)
        {
            if (!Enum.IsDefined(typeof(Category), id))
            {
                _logger.LogError("Category with ID: {Id} not found", id);
                return Results.NotFound("Category not found");
            }

            try
            {
                DateTime now = DateTime.Now; // Получаем текущее время здесь
                await _categoryService.UpdateCategoryColor(id, request.Color, now);
                _logger.LogInformation("Category color updated successfully for ID: {Id}", id);
                return Results.NoContent();
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Invalid color value: {Color}", request.Color);
                return Results.BadRequest("Invalid color value.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while updating category color for ID: {Id}", id);
                return Results.BadRequest(new { ex.Message });
            }

        }
    }
}
