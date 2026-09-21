using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrainingCenter.Api.DTOs.Enrollments;
using TrainingCenter.Api.Services;

namespace TrainingCenter.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly EnrollmentService _enrollmentService;

        public EnrollmentsController(EnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Enroll([FromBody] CreateEnrollmentDto dto)
        {
            var result = await _enrollmentService.EnrollStudentAsync(dto);
            if (!result.Success) return BadRequest(new { message = result.Message });

            return Ok(result.Data);
        }

        [Authorize]
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            var result = await _enrollmentService.CancelEnrollmentAsync(id);
            if (!result.Success) return NotFound(new { message = result.Message });

            return Ok(new { message = result.Message });
        }

        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetStudentsInCourse(int courseId)
        {
            var students = await _enrollmentService.GetStudentsInCourseAsync(courseId);
            return Ok(students);
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetCoursesForStudent(int studentId)
        {
            var courses = await _enrollmentService.GetCoursesForStudentAsync(studentId);
            return Ok(courses);
        }
    }
}