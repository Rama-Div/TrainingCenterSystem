namespace TrainingCenter.Api.DTOs.Students
{
    public class StudentResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Major { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
}