import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Instructor, CreateInstructorDto } from '../models/instructor';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  readonly httpClient = inject(HttpClient);
  readonly authService = inject(AuthService);
  readonly baseUrl = 'http://localhost:5025/api/instructors';

  getInstructors(): Observable<Instructor[]> {
    return this.httpClient.get<Instructor[]>(this.baseUrl);
  }

  getInstructorById(id: number): Observable<Instructor> {
    return this.httpClient.get<Instructor>(`${this.baseUrl}/${id}`);
  }

  createInstructor(dto: CreateInstructorDto): Observable<Instructor> {
    return this.httpClient.post<Instructor>(this.baseUrl, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateInstructor(id: number, dto: CreateInstructorDto): Observable<Instructor> {
    return this.httpClient.put<Instructor>(`${this.baseUrl}/${id}`, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteInstructor(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}