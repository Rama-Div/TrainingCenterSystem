using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainingCenter.Api.Data;
using TrainingCenter.Api.DTOs.Students;
using TrainingCenter.Api.Models;

namespace TrainingCenter.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly TrainingCenterDbContext _context;

        public StudentsController(TrainingCenterDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentResponseDto>>> GetStudents([FromQuery] string? name, [FromQuery] string? major)
        {
            var query = _context.Students.AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(s => s.Name.ToLower().Contains(name.ToLower()));

            if (!string.IsNullOrWhiteSpace(major))
                query = query.Where(s => s.Major.ToLower() == major.ToLower());

            var students = await query.Select(s => new StudentResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Email = s.Email,
                Age = s.Age,
                Major = s.Major,
                Phone = s.Phone
            }).ToListAsync();

            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentResponseDto>> GetStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            return Ok(new StudentResponseDto
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                Age = student.Age,
                Major = student.Major,
                Phone = student.Phone
            });
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<StudentResponseDto>> CreateStudent([FromBody] CreateStudentDto dto)
        {
            var student = new Student
            {
                Name = dto.Name,
                Email = dto.Email,
                Age = dto.Age,
                Major = dto.Major,
                Phone = dto.Phone
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            var response = new StudentResponseDto
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                Age = student.Age,
                Major = student.Major,
                Phone = student.Phone
            };

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, response);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] UpdateStudentDto dto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            student.Name = dto.Name;
            student.Email = dto.Email;
            student.Age = dto.Age;
            student.Major = dto.Major;
            student.Phone = dto.Phone;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}