import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course, CreateCourseDto } from '../models/course';
import { Student } from '../models/student';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  readonly httpClient = inject(HttpClient);
  readonly authService = inject(AuthService);
  readonly baseUrl = 'http://localhost:5025/api/courses';

  getCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.baseUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.httpClient.get<Course>(`${this.baseUrl}/${id}`);
  }

  getEnrolledStudents(courseId: number): Observable<Student[]> {
    return this.httpClient.get<Student[]>(`${this.baseUrl}/${courseId}/students`);
  }

  createCourse(dto: CreateCourseDto): Observable<Course> {
    return this.httpClient.post<Course>(this.baseUrl, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateCourse(id: number, dto: CreateCourseDto): Observable<Course> {
    return this.httpClient.put<Course>(`${this.baseUrl}/${id}`, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteCourse(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}