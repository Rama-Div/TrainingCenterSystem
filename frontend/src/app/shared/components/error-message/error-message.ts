import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `<div style="background: #ffe6e6; color: #cc0000; padding: 12px; border-radius: 4px; margin: 10px 0;"><p>{{ message() }}</p></div>`
})
export class ErrorMessage {
  message = input<string>('An unexpected error occurred.');
}