import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorService } from '../../../core/services/instructor.service';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';

@Component({
  selector: 'app-instructor-form',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorMessage],
  templateUrl: './instructor-form.html'
})
export class InstructorForm implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly instructorService = inject(InstructorService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  instructorId = signal<number | null>(null);
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    specialization: ['', [Validators.required]]
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.instructorId.set(+idParam);
      this.loadInstructorData(+idParam);
    }
  }

  loadInstructorData(id: number) {
    this.loading.set(true);
    this.instructorService.getInstructorById(id).subscribe({
      next: (instructor) => {
        this.form.patchValue(instructor);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Could not load instructor details.');
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    const dto = this.form.getRawValue();

    const id = this.instructorId();
    const request = id
      ? this.instructorService.updateInstructor(id, dto)
      : this.instructorService.createInstructor(dto);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/instructors']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400) {
          this.errorMessage.set('Invalid form entries. Please check inputs.');
        } else {
          this.errorMessage.set('Server error occurred while saving instructor.');
        }
      }
    });
  }
}