import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Course } from '../../../core/models/course';
import { Student } from '../../../core/models/student';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingMessage } from '../../../shared/components/loading-message/loading-message';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { EmptyMessage } from '../../../shared/components/empty-message/empty-message';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [RouterLink, DatePipe, LoadingMessage, ErrorMessage, EmptyMessage],
  templateUrl: './course-details.html'
})
export class CourseDetails implements OnInit {
  readonly courseService = inject(CourseService);
  readonly authService = inject(AuthService);
  readonly route = inject(ActivatedRoute);

  course = signal<Course | null>(null);
  registeredStudents = signal<Student[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadCourseData(+idParam);
    } else {
      this.loading.set(false);
      this.error.set('Invalid Course ID.');
    }
  }

  loadCourseData(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.courseService.getCourseById(id).subscribe({
      next: (courseData) => {
        this.course.set(courseData);
        this.loadEnrolledStudents(id);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Course not found or failed to load details.');
      }
    });
  }

  loadEnrolledStudents(courseId: number) {
    this.courseService.getEnrolledStudents(courseId).subscribe({
      next: (studentsData) => {
        this.registeredStudents.set(studentsData);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}