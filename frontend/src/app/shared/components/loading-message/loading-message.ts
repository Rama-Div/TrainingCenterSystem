import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-message',
  standalone: true,
  template: `<div style="text-align: center; padding: 20px; color: #555;"><p>Loading, please wait...</p></div>`
})
export class LoadingMessage {}