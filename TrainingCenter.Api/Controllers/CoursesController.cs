using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainingCenter.Api.Data;
using TrainingCenter.Api.DTOs.Courses;
using TrainingCenter.Api.DTOs.Instructors;
using TrainingCenter.Api.Models;

namespace TrainingCenter.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly TrainingCenterDbContext _context;

        public CoursesController(TrainingCenterDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseResponseDto>>> GetCourses()
        {
            var courses = await _context.Courses
                .Include(c => c.Instructor)
                .Select(c => new CourseResponseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Capacity = c.Capacity,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Instructor = c.Instructor == null ? null : new InstructorResponseDto
                    {
                        Id = c.Instructor.Id,
                        Name = c.Instructor.Name,
                        Email = c.Instructor.Email,
                        Specialization = c.Instructor.Specialization
                    }
                }).ToListAsync();

            return Ok(courses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDetailsDto>> GetCourse(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null) return NotFound();

            var details = new CourseDetailsDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Capacity = course.Capacity,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                Instructor = course.Instructor == null ? null : new InstructorResponseDto
                {
                    Id = course.Instructor.Id,
                    Name = course.Instructor.Name,
                    Email = course.Instructor.Email,
                    Specialization = course.Instructor.Specialization
                },
                RegisteredStudentCount = course.Enrollments.Count(e => e.Status == EnrollmentStatus.Active)
            };

            return Ok(details);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CourseResponseDto>> CreateCourse([FromBody] CreateCourseDto dto)
        {
            if (dto.EndDate <= dto.StartDate)
            {
                return BadRequest(new { message = "EndDate must be after StartDate." });
            }

            if (dto.InstructorId.HasValue && !await _context.Instructors.AnyAsync(i => i.Id == dto.InstructorId.Value))
            {
                return BadRequest(new { message = "Instructor not found." });
            }

            var course = new Course
            {
                Title = dto.Title,
                Description = dto.Description,
                Capacity = dto.Capacity,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                InstructorId = dto.InstructorId
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, dto);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] UpdateCourseDto dto)
        {
            if (dto.EndDate <= dto.StartDate)
            {
                return BadRequest(new { message = "EndDate must be after StartDate." });
            }

            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();

            if (dto.InstructorId.HasValue && !await _context.Instructors.AnyAsync(i => i.Id == dto.InstructorId.Value))
            {
                return BadRequest(new { message = "Instructor not found." });
            }

            course.Title = dto.Title;
            course.Description = dto.Description;
            course.Capacity = dto.Capacity;
            course.StartDate = dto.StartDate;
            course.EndDate = dto.EndDate;
            course.InstructorId = dto.InstructorId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpPost("{id}/assign-instructor")]
        public async Task<IActionResult> AssignInstructor(int id, [FromBody] AssignInstructorDto dto)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound(new { message = "Course not found." });

            var instructorExists = await _context.Instructors.AnyAsync(i => i.Id == dto.InstructorId);
            if (!instructorExists) return BadRequest(new { message = "Instructor not found." });

            course.InstructorId = dto.InstructorId;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Instructor assigned successfully." });
        }
    }
}