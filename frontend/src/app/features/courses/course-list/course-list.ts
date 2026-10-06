import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Course } from '../../../core/models/course';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingMessage } from '../../../shared/components/loading-message/loading-message';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { EmptyMessage } from '../../../shared/components/empty-message/empty-message';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [RouterLink, DatePipe, LoadingMessage, ErrorMessage, EmptyMessage],
  templateUrl: './course-list.html'
})
export class CourseList implements OnInit {
  readonly courseService = inject(CourseService);
  readonly authService = inject(AuthService);

  courses = signal<Course[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading.set(true);
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load courses.');
      }
    });
  }

  deleteCourse(id: number) {
    if (!confirm('Are you sure?')) return;
    this.courseService.deleteCourse(id).subscribe({
      next: () => this.loadCourses(),
      error: () => alert('Failed to delete course.')
    });
  }
}