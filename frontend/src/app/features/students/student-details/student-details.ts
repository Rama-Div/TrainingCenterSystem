import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Student } from '../../../core/models/student';
import { Course } from '../../../core/models/course';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingMessage } from '../../../shared/components/loading-message/loading-message';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { EmptyMessage } from '../../../shared/components/empty-message/empty-message';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [RouterLink, DatePipe, LoadingMessage, ErrorMessage, EmptyMessage],
  templateUrl: './student-details.html'
})
export class StudentDetails implements OnInit {
  readonly studentService = inject(StudentService);
  readonly authService = inject(AuthService);
  readonly route = inject(ActivatedRoute);

  student = signal<Student | null>(null);
  enrolledCourses = signal<Course[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadStudentData(+idParam);
    } else {
      this.loading.set(false);
      this.error.set('Invalid Student ID.');
    }
  }

  loadStudentData(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.studentService.getStudentById(id).subscribe({
      next: (studentData: Student) => {
        this.student.set(studentData);
        this.loadEnrolledCourses(id);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Student not found or failed to load details.');
      }
    });
  }

  loadEnrolledCourses(studentId: number) {
    this.studentService.getStudentCourses(studentId).subscribe({
      next: (coursesData: Course[]) => {
        this.enrolledCourses.set(coursesData);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}