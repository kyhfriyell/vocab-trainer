import { Component, input } from '@angular/core';

@Component({
  selector: 'app-study-content',
  imports: [],
  templateUrl: './study-content.html',
  styleUrl: './study-content.css',
})
export class StudyContent {
  headers = input.required<string[]>();
  words = input.required<any[]>();
  index = input.required<number>();
}
