export interface Course {
  id: number;
  title: string;
  description: string;
  capacity: number;
  startDate: string;
  endDate: string;
  instructorId?: number;
  instructorName?: string;
  registeredStudentCount?: number;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  capacity: number;
  startDate: string;
  endDate: string;
  instructorId?: number;
}