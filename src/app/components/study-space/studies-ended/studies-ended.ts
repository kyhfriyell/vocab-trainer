import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-studies-ended',
  imports: [],
  templateUrl: './studies-ended.html',
  styleUrl: './studies-ended.css',
})
export class StudiesEnded {
  private router = inject(Router);
  private location = inject(Location);
  @Output() restartClicked = new EventEmitter();

  
   onRestart()
  {
    this.restartClicked.emit();
  }

  onBack()
  {
    this.location.back();
  }
}
