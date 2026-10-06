import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styles: [`
    nav { display: flex; justify-content: space-between; background: #1f2937; padding: 1rem 2rem; color: #fff; }
    .nav-links { display: flex; gap: 1rem; align-items: center; }
    a { color: #d1d5db; text-decoration: none; }
    a:hover { color: #fff; }
    button { background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px; }
  `]
})
export class Navbar {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}