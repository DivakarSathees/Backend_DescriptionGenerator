using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly UniversityDbContext _context;

        public DepartmentController(UniversityDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Department>> CreateDepartment([FromBody] Department department)
        {
            _context.Departments.Add(department);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(CreateDepartment), new { id = department.DepartmentId }, department);
        }

        [HttpGet("Search")]
        public async Task<ActionResult<Department>> SearchDepartmentByName(string name)
        {
            var department = await _context.Departments.FindAsync(name);
            if (department == null)
                return NotFound();
            return Ok(department);
        }
    }
}