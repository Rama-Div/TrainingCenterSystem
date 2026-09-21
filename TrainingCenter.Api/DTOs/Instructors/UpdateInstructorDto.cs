using System.ComponentModel.DataAnnotations;

namespace TrainingCenter.Api.DTOs.Instructors
{
    public class UpdateInstructorDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Specialization { get; set; } = string.Empty;
    }
}