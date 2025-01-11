using Microsoft.AspNetCore.Mvc;
using SeriesTracker.Core.Abstractions;

namespace SeriesTracker.API.Controllers
{
    [ApiController]
    [Route("category")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;


        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<int>> GetCategoryList()
        {
            var categoryList = await _categoryService.GetCategoryList();
            return Ok(categoryList);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<int>> GetCategoryById(int id)
        {
            var category = await _categoryService.GetCategoryById(id);
            return Ok(category);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Guid>> UpdateCategoryColor(int id, [FromBody] string color)
        {
            var seriesId = await _categoryService.UpdateCategoryColor(id, color);
            return Ok(seriesId);
        }
    }
}
