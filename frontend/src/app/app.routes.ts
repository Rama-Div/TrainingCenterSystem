import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'students', pathMatch: 'full' },

  // Auth Routes
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register) 
  },

  // Students Routes
  { 
    path: 'students', 
    loadComponent: () => import('./features/students/student-list/student-list').then(m => m.StudentList) 
  },
  { 
    path: 'students/new', 
    loadComponent: () => import('./features/students/student-form/student-form').then(m => m.StudentForm) 
  },
  { 
    path: 'students/:id', 
    loadComponent: () => import('./features/students/student-details/student-details').then(m => m.StudentDetails) 
  },
  { 
    path: 'students/:id/edit', 
    loadComponent: () => import('./features/students/student-form/student-form').then(m => m.StudentForm) 
  },

  // Instructors Routes
  { 
    path: 'instructors', 
    loadComponent: () => import('./features/instructors/instructor-list/instructor-list').then(m => m.InstructorList) 
  },
  { 
    path: 'instructors/new', 
    loadComponent: () => import('./features/instructors/instructor-form/instructor-form').then(m => m.InstructorForm) 
  },
  { 
    path: 'instructors/:id/edit', 
    loadComponent: () => import('./features/instructors/instructor-form/instructor-form').then(m => m.InstructorForm) 
  },

  // Courses Routes
  { 
    path: 'courses', 
    loadComponent: () => import('./features/courses/course-list/course-list').then(m => m.CourseList) 
  },
  { 
    path: 'courses/new', 
    loadComponent: () => import('./features/courses/course-form/course-form').then(m => m.CourseForm) 
  },
  { 
    path: 'courses/:id', 
    loadComponent: () => import('./features/courses/course-details/course-details').then(m => m.CourseDetails) 
  },
  { 
    path: 'courses/:id/edit', 
    loadComponent: () => import('./features/courses/course-form/course-form').then(m => m.CourseForm) 
  },

  // Enrollments Routes
  { 
    path: 'enrollments/new', 
    loadComponent: () => import('./features/enrollments/enrollment-form/enrollment-form').then(m => m.EnrollmentForm) 
  },

  // Not Found Route
  { 
    path: '**', 
    loadComponent: () => import('./shared/components/empty-message/empty-message').then(m => m.EmptyMessage) 
  }
];