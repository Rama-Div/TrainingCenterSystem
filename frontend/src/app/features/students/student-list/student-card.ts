import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../../core/models/student';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="border: 1px solid #ccc; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; background: #fff;">
      <h3>{{ student().name }}</h3>
      <p><strong>Email:</strong> {{ student().email }}</p>
      <p><strong>Major:</strong> {{ student().major }} | <strong>Age:</strong> {{ student().age }}</p>
      <p><strong>Phone:</strong> {{ student().phone }}</p>
      <div style="display: flex; gap: 8px; margin-top: 10px;">
        <a [routerLink]="['/students', student().id]" style="color: blue;">View Details</a>
        @if (isLoggedIn()) {
          <a [routerLink]="['/students', student().id, 'edit']" style="color: green;">Edit</a>
          <button (click)="onDelete.emit(student().id)" style="color: red; cursor: pointer;">Delete</button>
        }
      </div>
    </div>
  `
})
export class StudentCard {
  student = input.required<Student>();
  isLoggedIn = input<boolean>(false);
  onDelete = output<number>();
}