import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { StudentService } from '../../../core/services/student.service';
import { CourseService } from '../../../core/services/course.service';
import { Student } from '../../../core/models/student';
import { Course } from '../../../core/models/course';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorMessage],
  templateUrl: './enrollment-form.html'
})
export class EnrollmentForm implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly enrollmentService = inject(EnrollmentService);
  readonly studentService = inject(StudentService);
  readonly courseService = inject(CourseService);

  students = signal<Student[]>([]);
  courses = signal<Course[]>([]);
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.fb.group({
    studentId: [null as number | null, [Validators.required]],
    courseId: [null as number | null, [Validators.required]]
  });

  ngOnInit() {
    this.studentService.getStudents().subscribe((data) => this.students.set(data));
    this.courseService.getCourses().subscribe((data) => this.courses.set(data));
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const dto = {
      studentId: Number(this.form.value.studentId),
      courseId: Number(this.form.value.courseId)
    };

    this.enrollmentService.enroll(dto).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Enrollment created successfully.');
        this.form.reset();
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404) {
          this.errorMessage.set('Student or Course not found.');
        } else if (err.status === 409) {
          this.errorMessage.set('Student is already enrolled OR the course is full.');
        } else {
          this.errorMessage.set('Failed to complete enrollment request.');
        }
      }
    });
  }
}