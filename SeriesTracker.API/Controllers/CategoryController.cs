using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Core.Abstractions;
using SeriesTracker.Core.Enums;
using SeriesTracker.Infrastructure.Authentication;
using SeriesTracker.API.Extensions;

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
                return _logger.InternalServerError(ex, "An unexpected error occurred while getting all categories");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IResult> GetCategoryById(int id)
        {
            if (!Enum.IsDefined(typeof(Category), id))
            {
                return _logger.NotFoundResponse($"Category with ID: {id} not found");
            }

            try
            {
                var category = await _categoryService.GetCategoryById(id);
                return Results.Ok(category);

            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, $"An unexpected error occurred while getting category with ID: {id}");
            }
        }

        [RequirePermission(Permission.Update)]
        [HttpPut("{id:int}")]
        public async Task<IResult> UpdateCategoryColor(int id, [FromBody] UpdateCategoryColorRequest request)
        {
            if (!Enum.IsDefined(typeof(Category), id))
            {
                return _logger.NotFoundResponse($"Category with ID: {id} not found");
            }

            try
            {
                await _categoryService.UpdateCategoryColor(id, request.Color);
                _logger.LogInformation("Category color updated successfully for ID: {Id}", id);

                return Results.Json(new { Message = "Category color was updated successfully" }, statusCode: StatusCodes.Status204NoContent);
            }
            catch (Exception ex)
            {
                return _logger.InternalServerError(ex, $"An unexpected error occurred while updating category color for ID: {id}");
            }

        }
    }
}
