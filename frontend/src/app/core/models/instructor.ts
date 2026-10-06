export interface Instructor {
  id: number;
  name: string;
  email: string;
  specialization: string;
}

export interface CreateInstructorDto {
  name: string;
  email: string;
  specialization: string;
}