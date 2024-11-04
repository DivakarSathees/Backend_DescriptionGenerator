using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using Microsoft.AspNetCore.Mvc.Controllers;
using System;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfessorController : ControllerBase
    {
        private readonly UniversityDbContext _context;

        public ProfessorController(UniversityDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Professor>> CreateProfessor([FromBody] Professor professor)
        {
            if ( professor.DepartmentId <= 0 )
                return BadRequest("DepartmentId is required");
            if ( professor.Ranking <= 0 )
                throw new RankingException("Ranking cannot be 0 or negative");

            _context.Professors.Add(professor);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(CreateProfessor), new { id = professor.ProfessorId }, professor);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Professor>>> GetProfessors()
        {
            var professors = await _context.Professors.ToListAsync();
            if (professors.Count == 0)
                return NoContent();
            return Ok(professors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Professor>> GetProfessor(int id)
        {
            var professor = await _context.Professors.FindAsync(id);
            if (professor == null)
                return NotFound();
            return Ok(professor);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProfessor(int id)
        {
            var professor = await _context.Professors.FindAsync(id);
            if (professor == null)
                return NotFound();
            _context.Professors.Remove(professor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}