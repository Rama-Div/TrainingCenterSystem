import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Instructor } from '../../../core/models/instructor';
import { InstructorService } from '../../../core/services/instructor.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingMessage } from '../../../shared/components/loading-message/loading-message';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { EmptyMessage } from '../../../shared/components/empty-message/empty-message';

@Component({
  selector: 'app-instructor-list',
  standalone: true,
  imports: [RouterLink, LoadingMessage, ErrorMessage, EmptyMessage],
  templateUrl: './instructor-list.html'
})
export class InstructorList implements OnInit {
  readonly instructorService = inject(InstructorService);
  readonly authService = inject(AuthService);

  instructors = signal<Instructor[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadInstructors();
  }

  loadInstructors() {
    this.loading.set(true);
    this.instructorService.getInstructors().subscribe({
      next: (data) => {
        this.instructors.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load instructors.');
      }
    });
  }

  deleteInstructor(id: number) {
    if (!confirm('Are you sure?')) return;
    this.instructorService.deleteInstructor(id).subscribe({
      next: () => this.loadInstructors(),
      error: () => alert('Failed to delete instructor.')
    });
  }
}