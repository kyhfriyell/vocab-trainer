import { Component, input } from '@angular/core';

@Component({
  selector: 'app-headers',
  imports: [],
  templateUrl: './headers.html',
  styleUrl: './headers.css',
})
export class Headers {
  headers = input.required<string[]>();
}
