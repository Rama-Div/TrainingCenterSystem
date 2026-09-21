using System.ComponentModel.DataAnnotations;

namespace TrainingCenter.Api.DTOs.Enrollments
{
    public class CreateEnrollmentDto
    {
        [Required]
        public int StudentId { get; set; }

        [Required]
        public int CourseId { get; set; }
    }
}