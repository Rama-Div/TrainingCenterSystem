import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ErrorMessage],
  templateUrl: './login.html'
})
export class Login {
  readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400 || err.status === 401) {
          this.errorMessage.set('Invalid email or password.');
        } else {
          this.errorMessage.set('Server error occurred during login.');
        }
      }
    });
  }
}