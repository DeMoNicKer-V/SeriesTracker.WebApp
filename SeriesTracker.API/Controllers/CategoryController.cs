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
            var seriesCount = await _categoryService.GetCategoryList();
            return Ok(seriesCount);
        }
    }
}
