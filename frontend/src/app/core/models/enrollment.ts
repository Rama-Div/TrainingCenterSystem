export interface CreateEnrollmentDto {
  studentId: number;
  courseId: number;
}

export interface EnrollmentResponse {
  id: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string;
}