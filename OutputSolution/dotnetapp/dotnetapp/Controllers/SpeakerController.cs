
using dotnetapp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;

namespace dotnetapp.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class SpeakerController : ControllerBase{
        private readonly ApplicationDbContext _context;

        public SpeakerController(ApplicationDbContext context){
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Speaker>>> GetSpeakers(){
            return await _context.Speakers.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Speaker>> GetSpeaker(int id){
            var speaker = await _context.Speakers.FindAsync(id);
            if (speaker == null){
                return NotFound();
            }
            return speaker;
        }

        [HttpPost]
        public async Task<ActionResult<Speaker>> PostSpeaker(Speaker speaker){
            _context.Speakers.Add(speaker);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSpeaker), new { id = speaker.SpeakerId }, speaker);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutSpeaker(int id, Speaker speaker){
            if (id != speaker.SpeakerId){
                return BadRequest();
            }
            _context.Entry(speaker).State = EntityState.Modified;
            try{
                await _context.SaveChangesAsync();
            }catch (DbUpdateConcurrencyException){
                if (!await SpeakerExists(id)){
                    return NotFound();
                } else{
                    throw;
                }
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSpeaker(int id){
            var speaker = await _context.Speakers.FindAsync(id);
            if (speaker == null){
                return NotFound();
            }
            _context.Speakers.Remove(speaker);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<bool> SpeakerExists(int id){
            return await _context.Speakers.AnyAsync(s => s.SpeakerId == id);
        }
    }
}