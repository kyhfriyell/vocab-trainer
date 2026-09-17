import { Component, inject, OnInit } from '@angular/core';
import { FileService } from '../../services/file-service';
import { Router } from '@angular/router';
import { Card } from "../card/card";
import { Headers } from "../card/headers/headers";
import { signal } from '@angular/core';
import { Button } from "../button/button";

@Component({
  selector: 'app-xlsx-sheet-infos',
  imports: [Card, Headers, Button],
  templateUrl: './xlsx-sheet-infos.html',
  styleUrl: './xlsx-sheet-infos.css',
})
export class XlsxSheetInfos implements OnInit {

  private router = inject(Router);
  private fileService = inject(FileService);
  private headers: string[] = [];
  private showingFront = true;
  
  sheetName = signal("");
  backColumns = signal<string[]>([]);
  frontColumns = signal<string[]>([]);

  ngOnInit() 
  {
      let sheet = this.fileService.sheet;

      this.sheetName.set(sheet.sheetName);
      let rows = sheet.entries;

      // filter to remove columns that are not used in any row
      this.headers = Object.keys(sheet.entries[0]).filter(col =>
        rows.some(row => row[col] !== null && row[col] !== undefined) 
      );

      this.backColumns.update((bc: string [])=>  [...this.fileService.backColumns.filter(h => this.headers.includes(h))]);
      this.frontColumns.update((fc: string [])=>  [...this.fileService.frontColumns.filter(h => this.headers.includes(h))]);
  }

  get wordCount() 
  {
    return this.fileService.sheet.entries.length;
  }

  get sheetHeaders()
  {
    return this.headers;
  }

  get canStart()
  {
    return this.frontColumns().length > 0 && this.backColumns().length > 0;
  }

  get isShowingFront() {
    return this.showingFront;
  }

  switchSide() {
    this.showingFront = !this.showingFront;
  }

  toggleFrontHeader(header: string) {
     const alreadyChecked = this.frontColumns().find(e => e === header) ? true : false;
    if (!alreadyChecked) {
      this.frontColumns.update((h: string[]) => [...h, header])
    } else {
      this.frontColumns.set(this.frontColumns().filter((h: string) => h !== header));
    }
  }


  toggleBackHeader(header: string) {
    const alreadyChecked = this.backColumns().find(e => e === header) ? true : false;
    if (!alreadyChecked) {
      this.backColumns.update((h: string[]) => [...h, header])
    } else {
      this.backColumns.set(this.backColumns().filter((h: string) => h !== header));
    }
  }

 
  isSelected(header: string, collection: string[]): boolean {
    return collection.includes(header);
  }

  getPosition(header: string, collection: string[]): number | null {
    const index = collection.indexOf(header);
    return index >= 0 ? index + 1 : null;
  }

  onStart()
  {
    if(this.canStart)
    {
      this.saveColumns();
      this.fileService.deactivateSplit();
      this.router.navigate(['/study-space']);
    }
  }

  splitPack()
  {
    if(this.canStart)
    {
      this.saveColumns();
      this.router.navigate(['/split-pack']);
    }
  }

  private saveColumns()
  {
    this.fileService.setSelectedColumns(this.frontColumns(), this.backColumns());
  }

}
