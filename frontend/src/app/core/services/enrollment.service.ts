import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateEnrollmentDto, EnrollmentResponse } from '../models/enrollment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  readonly httpClient = inject(HttpClient);
  readonly authService = inject(AuthService);
  readonly baseUrl = 'http://localhost:5025/api/enrollments';

  enroll(dto: CreateEnrollmentDto): Observable<EnrollmentResponse> {
    return this.httpClient.post<EnrollmentResponse>(this.baseUrl, dto, {
      headers: this.authService.getAuthHeaders()
    });
  }
}