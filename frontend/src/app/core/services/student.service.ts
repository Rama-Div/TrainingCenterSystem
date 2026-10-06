import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student, CreateStudentDto } from '../models/student';
import { Course } from '../models/course';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  readonly httpClient = inject(HttpClient);
  readonly authService = inject(AuthService);
  readonly baseUrl = 'http://localhost:5025/api/students';

  getStudents(search?: string, major?: string): Observable<Student[]> {
    let url = this.baseUrl;
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (major) params.push(`major=${encodeURIComponent(major)}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    return this.httpClient.get<Student[]>(url);
  }

  getStudentById(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`${this.baseUrl}/${id}`);
  }

  getStudentCourses(id: number): Observable<Course[]> {
    return this.httpClient.get<Course[]>(`${this.baseUrl}/${id}/courses`);
  }

  createStudent(dto: CreateStudentDto): Observable<Student> {
    return this.httpClient.post<Student>(this.baseUrl, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateStudent(id: number, dto: CreateStudentDto): Observable<Student> {
    return this.httpClient.put<Student>(`${this.baseUrl}/${id}`, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteStudent(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}