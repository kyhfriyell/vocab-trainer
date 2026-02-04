import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-sheet',
  imports: [],
  templateUrl: './sheet.html',
  styleUrl: './sheet.css',
})
export class Sheet {

  public sheetName = input.required<string>();
  public rowCount = input.required<number>();
  @Output() sheetClicked = new EventEmitter<string>();

  onClicked() 
  {
    this.sheetClicked.emit(this.sheetName());
  }
}
