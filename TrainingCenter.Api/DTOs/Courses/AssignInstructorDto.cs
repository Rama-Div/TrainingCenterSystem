using System.ComponentModel.DataAnnotations;

namespace TrainingCenter.Api.DTOs.Courses
{
    public class AssignInstructorDto
    {
        [Required]
        public int InstructorId { get; set; }
    }
}