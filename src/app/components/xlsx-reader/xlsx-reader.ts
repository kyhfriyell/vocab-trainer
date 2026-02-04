import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from "xlsx";
import { XlsxFile, XlsxSheet } from '../../models/xlsx-file.model';
import { FileService } from '../../services/file-service';

@Component({
  selector: 'app-xlsx-reader',
  imports: [],
  templateUrl: './xlsx-reader.html',
  styleUrl: './xlsx-reader.css',
})
export class XlsxReader {

  private router = inject(Router);
  private fileService = inject(FileService);
  private fileAsObject!: XlsxFile;

  public isDragOver = false;

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.processFile(input.files[0]);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    this.processFile(file);
  }

  private processFile(file: File) {
    this.createFileAsObject(file.name);

    const reader = new FileReader();
    reader.onload = (e: any) => this.handleFile(e); // set up the function to be called when we start reading the file
    reader.readAsArrayBuffer(file); // starts reading the file, and goes inside the onload
  }

  private handleFile(e: any){
    const data = new Uint8Array(e.target.result);
    const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];

      const sheetData = XLSX.utils.sheet_to_json(worksheet, {
        defval: null, // skips empty cells
        // forcing to have a header row by not specifying one
        //header: 'A', // will make the column names like A, B, C, ... So the first row is not taken as a header
        
        blankrows: false, 
        skipHidden: true
      });
      
      this.addNewSheetToCreatedFile(sheetName, sheetData);
    });

    this.fileService.setFile(this.fileAsObject);
    this.router.navigate(['/sheet-chooser']); // navigating here, after the file is read
  }

  private createFileAsObject(fileName: string){
    this.fileAsObject = {fileName: fileName, sheets: []};
  }

  private addNewSheetToCreatedFile(sheetName: string, sheetData: any[]){
    let newSheet: XlsxSheet = {sheetName: sheetName, entries: sheetData};
    this.fileAsObject.sheets.push(newSheet);
  }

}
