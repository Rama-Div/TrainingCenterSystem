export interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  major: string;
  phone: string;
}

export interface CreateStudentDto {
  name: string;
  email: string;
  age: number;
  major: string;
  phone: string;
}