import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-message',
  standalone: true,
  template: `<div style="text-align: center; padding: 30px; color: #888; background: #f9f9f9; border-radius: 6px;"><p>{{ message() }}</p></div>`
})
export class EmptyMessage {
  message = input<string>('No records found.');
}