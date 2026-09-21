using TrainingCenter.Api.DTOs.Instructors;

namespace TrainingCenter.Api.DTOs.Courses
{
    public class CourseResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public InstructorResponseDto? Instructor { get; set; }
    }
}