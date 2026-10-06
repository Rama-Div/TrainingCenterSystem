import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Student } from '../../../core/models/student';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';
import { StudentCard } from './student-card';
import { LoadingMessage } from '../../../shared/components/loading-message/loading-message';
import { ErrorMessage } from '../../../shared/components/error-message/error-message';
import { EmptyMessage } from '../../../shared/components/empty-message/empty-message';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink, StudentCard, LoadingMessage, ErrorMessage, EmptyMessage],
  templateUrl: './student-list.html'
})
export class StudentList implements OnInit {
  readonly studentService = inject(StudentService);
  readonly authService = inject(AuthService);

  students = signal<Student[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  searchQuery = signal<string>('');
  selectedMajor = signal<string>('');

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.loading.set(true);
    this.error.set(null);

    this.studentService.getStudents(this.searchQuery(), this.selectedMajor()).subscribe({
      next: (data: Student[]) => {
        this.students.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set('Failed to fetch students list from server.');
      }
    });
  }

  onSearchChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.loadStudents();
  }

  onMajorChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.selectedMajor.set(val);
    this.loadStudents();
  }

  deleteStudent(id: number) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    this.studentService.deleteStudent(id).subscribe({
      next: () => this.loadStudents(),
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          alert('Cannot delete student with active course enrollments.');
        } else {
          alert('Failed to delete student.');
        }
      }
    });
  }
}