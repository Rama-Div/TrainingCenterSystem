using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainingCenter.Api.Data;
using TrainingCenter.Api.DTOs.Instructors;
using TrainingCenter.Api.Models;

namespace TrainingCenter.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstructorsController : ControllerBase
    {
        private readonly TrainingCenterDbContext _context;

        public InstructorsController(TrainingCenterDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InstructorResponseDto>>> GetInstructors()
        {
            var instructors = await _context.Instructors.Select(i => new InstructorResponseDto
            {
                Id = i.Id,
                Name = i.Name,
                Email = i.Email,
                Specialization = i.Specialization
            }).ToListAsync();

            return Ok(instructors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InstructorResponseDto>> GetInstructor(int id)
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null) return NotFound();

            return Ok(new InstructorResponseDto
            {
                Id = instructor.Id,
                Name = instructor.Name,
                Email = instructor.Email,
                Specialization = instructor.Specialization
            });
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<InstructorResponseDto>> CreateInstructor([FromBody] CreateInstructorDto dto)
        {
            var instructor = new Instructor
            {
                Name = dto.Name,
                Email = dto.Email,
                Specialization = dto.Specialization
            };

            _context.Instructors.Add(instructor);
            await _context.SaveChangesAsync();

            var response = new InstructorResponseDto
            {
                Id = instructor.Id,
                Name = instructor.Name,
                Email = instructor.Email,
                Specialization = instructor.Specialization
            };

            return CreatedAtAction(nameof(GetInstructor), new { id = instructor.Id }, response);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInstructor(int id, [FromBody] UpdateInstructorDto dto)
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null) return NotFound();

            instructor.Name = dto.Name;
            instructor.Email = dto.Email;
            instructor.Specialization = dto.Specialization;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInstructor(int id)
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor == null) return NotFound();

            _context.Instructors.Remove(instructor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}