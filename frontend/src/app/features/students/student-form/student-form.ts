import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorMessage],
  templateUrl: './student-form.html'
})
export class StudentForm implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly studentService = inject(StudentService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  studentId = signal<number | null>(null);
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    age: [18, [Validators.required, Validators.min(16), Validators.max(100)]],
    major: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]]
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.studentId.set(+idParam);
      this.loadStudentData(+idParam);
    }
  }

  loadStudentData(id: number) {
    this.loading.set(true);
    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        this.form.patchValue(student);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Could not load student information.');
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    const dto = this.form.getRawValue();

    const id = this.studentId();
    const request = id
      ? this.studentService.updateStudent(id, dto)
      : this.studentService.createStudent(dto);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400) {
          this.errorMessage.set('Invalid form inputs. Please check entries.');
        } else {
          this.errorMessage.set('Server error while saving student.');
        }
      }
    });
  }
}