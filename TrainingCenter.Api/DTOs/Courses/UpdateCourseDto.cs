using System.ComponentModel.DataAnnotations;

namespace TrainingCenter.Api.DTOs.Courses
{
    public class UpdateCourseDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Capacity { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public int? InstructorId { get; set; }
    }
}