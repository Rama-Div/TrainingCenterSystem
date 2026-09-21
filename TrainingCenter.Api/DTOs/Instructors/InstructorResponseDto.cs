namespace TrainingCenter.Api.DTOs.Instructors
{
    public class InstructorResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
    }
}