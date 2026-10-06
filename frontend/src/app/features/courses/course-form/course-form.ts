import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { InstructorService } from '../../../core/services/instructor.service';
import { Instructor } from '../../../core/models/instructor';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorMessage],
  templateUrl: './course-form.html'
})
export class CourseForm implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly courseService = inject(CourseService);
  readonly instructorService = inject(InstructorService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  courseId = signal<number | null>(null);
  instructors = signal<Instructor[]>([]);
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    capacity: [30, [Validators.required, Validators.min(1)]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    instructorId: [null as number | null]
  });

  ngOnInit() {
    this.loadInstructors();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId.set(+id);
      this.loadCourse(+id);
    }
  }

  loadInstructors() {
    this.instructorService.getInstructors().subscribe({
      next: (data: Instructor[]) => this.instructors.set(data),
      error: () => this.errorMessage.set('Failed to load instructor list.')
    });
  }

  loadCourse(id: number) {
    this.courseService.getCourseById(id).subscribe({
      next: (course) => this.form.patchValue(course),
      error: () => this.errorMessage.set('Failed to load course details.')
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    const raw = this.form.getRawValue();
    const dto = {
      title: raw.title!,
      description: raw.description!,
      capacity: raw.capacity!,
      startDate: raw.startDate!,
      endDate: raw.endDate!,
      instructorId: raw.instructorId ? Number(raw.instructorId) : undefined
    };

    const id = this.courseId();
    const request = id
      ? this.courseService.updateCourse(id, dto)
      : this.courseService.createCourse(dto);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/courses']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Failed to save course data.');
      }
    });
  }
}