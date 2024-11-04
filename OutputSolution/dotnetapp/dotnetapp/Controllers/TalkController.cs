
using dotnetapp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;

namespace dotnetapp.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class TalkController : ControllerBase{
        private readonly ApplicationDbContext _context;

        public TalkController(ApplicationDbContext context){
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Talk>>> GetTalks(){
            return await _context.Talks.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Talk>> GetTalk(int id){
            var talk = await _context.Talks.FindAsync(id);
            if (talk == null){
                return NotFound();
            }
            return talk;
        }

        [HttpPost]
        public async Task<ActionResult<Talk>> PostTalk(Talk talk){
            if (talk.Duration <= 0){
                throw new InvalidDurationException("Duration cannot be 0 or negative.");
            }
            _context.Talks.Add(talk);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTalk), new { id = talk.TalkId }, talk);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTalk(int id){
            var talk = await _context.Talks.FindAsync(id);
            if (talk == null){
                return NotFound();
            }
            _context.Talks.Remove(talk);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}