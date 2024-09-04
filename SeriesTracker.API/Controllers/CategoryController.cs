using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeriesTracker.API.Contracts;
using SeriesTracker.Application.Services;
using SeriesTracker.Core.Abstractions;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
        public async Task<ActionResult<Guid>> UpdateSeries(int id, [FromBody] CategoryRequest request)
        {
            var date = DateTime.Now.ToString("s");
            var seriesId = await _categoryService.UpdateCategory(id, request.Title, request.Color, date);
            return Ok(seriesId);
        }
    }
}
