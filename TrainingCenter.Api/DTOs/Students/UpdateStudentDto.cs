using System.ComponentModel.DataAnnotations;

namespace TrainingCenter.Api.DTOs.Students
{
    public class UpdateStudentDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Range(16, 100)]
        public int Age { get; set; }

        [Required]
        public string Major { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;
    }
}