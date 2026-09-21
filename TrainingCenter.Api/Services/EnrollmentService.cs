using Microsoft.EntityFrameworkCore;
using TrainingCenter.Api.Data;
using TrainingCenter.Api.DTOs.Enrollments;
using TrainingCenter.Api.Models;

namespace TrainingCenter.Api.Services
{
    public class EnrollmentService
    {
        private readonly TrainingCenterDbContext _context;

        public EnrollmentService(TrainingCenterDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message, EnrollmentResponseDto? Data)> EnrollStudentAsync(CreateEnrollmentDto dto)
        {
            var student = await _context.Students.FindAsync(dto.StudentId);
            if (student == null) return (false, "Student not found.", null);

            var course = await _context.Courses.Include(c => c.Enrollments).FirstOrDefaultAsync(c => c.Id == dto.CourseId);
            if (course == null) return (false, "Course not found.", null);

            var existingEnrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentId == dto.StudentId && e.CourseId == dto.CourseId);

            if (existingEnrollment != null && existingEnrollment.Status == EnrollmentStatus.Active)
            {
                return (false, "Student is already enrolled in this course.", null);
            }

            int activeCount = course.Enrollments.Count(e => e.Status == EnrollmentStatus.Active);
            if (activeCount >= course.Capacity)
            {
                return (false, "Course is full.", null);
            }

            Enrollment enrollment;
            if (existingEnrollment != null)
            {
                existingEnrollment.Status = EnrollmentStatus.Active;
                existingEnrollment.EnrollmentDate = DateTime.UtcNow;
                enrollment = existingEnrollment;
            }
            else
            {
                enrollment = new Enrollment
                {
                    StudentId = dto.StudentId,
                    CourseId = dto.CourseId,
                    EnrollmentDate = DateTime.UtcNow,
                    Status = EnrollmentStatus.Active
                };
                _context.Enrollments.Add(enrollment);
            }

            await _context.SaveChangesAsync();

            var response = new EnrollmentResponseDto
            {
                Id = enrollment.Id,
                StudentId = student.Id,
                StudentName = student.Name,
                CourseId = course.Id,
                CourseTitle = course.Title,
                EnrollmentDate = enrollment.EnrollmentDate,
                Status = enrollment.Status.ToString()
            };

            return (true, "Enrollment successful.", response);
        }

        public async Task<(bool Success, string Message)> CancelEnrollmentAsync(int id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null) return (false, "Enrollment record not found.");

            enrollment.Status = EnrollmentStatus.Cancelled;
            await _context.SaveChangesAsync();

            return (true, "Enrollment cancelled successfully.");
        }

        public async Task<List<CourseStudentDto>> GetStudentsInCourseAsync(int courseId)
        {
            return await _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .Select(e => new CourseStudentDto
                {
                    StudentId = e.StudentId,
                    StudentName = e.Student.Name,
                    Email = e.Student.Email,
                    EnrollmentDate = e.EnrollmentDate,
                    Status = e.Status.ToString()
                })
                .ToListAsync();
        }

        public async Task<List<StudentCourseDto>> GetCoursesForStudentAsync(int studentId)
        {
            return await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Select(e => new StudentCourseDto
                {
                    CourseId = e.CourseId,
                    CourseTitle = e.Course.Title,
                    StartDate = e.Course.StartDate,
                    EndDate = e.Course.EndDate,
                    Status = e.Status.ToString()
                })
                .ToListAsync();
        }
    }
}