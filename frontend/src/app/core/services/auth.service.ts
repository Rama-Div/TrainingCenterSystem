import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly httpClient = inject(HttpClient);
  readonly baseUrl = 'http://localhost:5025/api/auth';

  isLoggedIn = signal<boolean>(!!this.getToken());

  register(dto: RegisterRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/register`, dto);
  }

  login(dto: LoginRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/login`, dto).pipe(
      tap((res) => {
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('jwt_expiration', res.expiration);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('jwt_expiration');
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}