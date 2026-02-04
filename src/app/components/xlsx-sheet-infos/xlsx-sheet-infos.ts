import { Component, inject, OnInit } from '@angular/core';
import { FileService } from '../../services/file-service';
import { Router } from '@angular/router';
import { Card } from "../card/card";
import { Headers } from "../card/headers/headers";
import { signal } from '@angular/core';

@Component({
  selector: 'app-xlsx-sheet-infos',
  imports: [Card, Headers],
  templateUrl: './xlsx-sheet-infos.html',
  styleUrl: './xlsx-sheet-infos.css',
})
export class XlsxSheetInfos implements OnInit {

  private router = inject(Router);
  private fileService = inject(FileService);
  private headers: string[] = [];
  
  backColumns = signal<string[]>([]);
  frontColumns = signal<string[]>([]);

  ngOnInit() 
  {
      let sheet = this.fileService.sheet;
      let rows = sheet.entries;
      // filter to remove columns that are not used in any row
      this.headers = Object.keys(sheet.entries[0]).filter(col =>
        rows.some(row => row[col] !== null && row[col] !== undefined) 
      );

      this.backColumns.update((bc: string [])=>  [...this.fileService.backColumns]);
      this.frontColumns.update((fc: string [])=>  [...this.fileService.frontColumns]);
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

  toggleFrontHeader(header: string, checked: boolean) {
    if (checked) {
      this.frontColumns.update((h: string[]) => [...h, header])
    } else {
      this.frontColumns.set(this.frontColumns().filter((h: string) => h !== header));
    }
  }

  toggleFrontHeaderFromName(header: string) {
    const checked = this.frontColumns().find(e => e === header) ? true : false;
    this.toggleFrontHeader(header, !checked);
  }

  toggleBackHeader(header: string, checked: boolean) {
    if (checked) {
      this.backColumns.update((h: string[]) => [...h, header])
    } else {
      this.backColumns.set(this.backColumns().filter((h: string) => h !== header));
    }
  }

  toggleBackHeaderFromName(header: string) {
    const checked = this.backColumns().find(e => e === header) ? true : false;
    this.toggleBackHeader(header, !checked);
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
      this.fileService.setSelectedColumns(this.frontColumns(), this.backColumns());
      this.router.navigate(['/study-space']);
    }
  }

}
