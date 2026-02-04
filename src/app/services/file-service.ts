import { Injectable } from '@angular/core';
import { XlsxFile, XlsxSheet } from '../models/xlsx-file.model';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private XLSX_FILE_KEY = 'vocab-file';
  private XLSX_SHEET_KEY = 'sheet-file';
  private SELECTED_FRONT_COLUMNS_KEY = 'selected-front-columns';
  private SELECTED_BACK_COLUMNS_KEY = 'selected-back-columns';

  private xlsxFile: XlsxFile = {fileName: '', sheets: []};
  private selectedSheet: XlsxSheet = {sheetName: '', entries: []};
  private _frontColumns: string[] = [];
  private _backColumns: string[] = [];

  constructor(){
    this.load();
  }

  get file()
  {
    return this.xlsxFile;
  }

  get sheet()
  {
    return this.selectedSheet;
  }

  get frontColumns()
  {
    return this._frontColumns;
  }

  get backColumns()
  {
    return this._backColumns;
  }

  public setFile(file: XlsxFile)
  {
    this.xlsxFile = file;
    this.saveFile();
  }

  public selectSheet(name: string)
  {
    let sheetByName = this.xlsxFile.sheets.find(s => s.sheetName === name);
    if(sheetByName){
      this.selectedSheet = sheetByName;
      this.saveSheet();
    }
    else
      this.selectedSheet = {sheetName: '', entries: []};
  }

  public setSelectedColumns(front: string[], back: string[])
  {
    this._frontColumns = front;
    this._backColumns = back;
    this.saveColumns();
  }

  // To save/load the state of the service in LocalStorage
  private saveFile() {
    localStorage.setItem(this.XLSX_FILE_KEY, JSON.stringify(this.xlsxFile));
  }

  private saveSheet() {
    localStorage.setItem(this.XLSX_SHEET_KEY, JSON.stringify(this.selectedSheet));
  }

  private saveColumns() {
    localStorage.setItem(this.SELECTED_FRONT_COLUMNS_KEY, JSON.stringify(this._frontColumns));
    localStorage.setItem(this.SELECTED_BACK_COLUMNS_KEY, JSON.stringify(this._backColumns));
  }

  private load() {
    const fileData = localStorage.getItem(this.XLSX_FILE_KEY);
    const sheetData = localStorage.getItem(this.XLSX_SHEET_KEY);
    const frontColumnsData = localStorage.getItem(this.SELECTED_FRONT_COLUMNS_KEY);
    const backColumnsData = localStorage.getItem(this.SELECTED_BACK_COLUMNS_KEY);

    if (fileData) {
      this.xlsxFile = JSON.parse(fileData);
    }

    if(sheetData){
      this.selectedSheet = JSON.parse(sheetData);
    }

    if(frontColumnsData){
      this._frontColumns = JSON.parse(frontColumnsData);
    }

    if(backColumnsData){
      this._backColumns = JSON.parse(backColumnsData);
    }
  }

}
