import { Injectable } from '@angular/core';
import { XlsxFile, XlsxSheet } from '../models/xlsx-file.model';
import { SplitInfos } from '../models/split-infos';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private XLSX_FILE_KEY = 'vocab-file';
  private XLSX_SHEET_KEY = 'sheet-file';
  private SELECTED_FRONT_COLUMNS_KEY = 'selected-front-columns';
  private SELECTED_BACK_COLUMNS_KEY = 'selected-back-columns';
  private SPLIT_INFOS_KEY = 'split-infos';

  private xlsxFile: XlsxFile = {fileName: '', sheets: []};
  private selectedSheet: XlsxSheet = {sheetName: '', entries: []};
  private _frontColumns: string[] = [];
  private _backColumns: string[] = [];
  private _splitInfos: SplitInfos = {nbSplit: 1, lastSelectedPack: -1, useSplit: false};

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

  get splitInfos()
  {
    return this._splitInfos;
  }

  get cards()
  {
    let allCards = [...this.selectedSheet.entries];
    let cardsToStudy = [];
    let cardsToTake = 0;
    let startIndex = 0;

    if(this.splitInfos.useSplit){
      // If we split the pack
      if(this.splitInfos.nbSplit > 1)
      {
        cardsToTake = allCards.length / this.splitInfos.nbSplit;

        // If we selected the last pack
        if(this.splitInfos.lastSelectedPack == this.splitInfos.nbSplit - 1){
          cardsToTake += allCards.length % this.splitInfos.nbSplit;
        }
        
        startIndex = (allCards.length / this.splitInfos.nbSplit) * this.splitInfos.lastSelectedPack;
        
        // Select cards between two indexes
        cardsToStudy = allCards.slice(startIndex, startIndex + cardsToTake -1);
        return cardsToStudy;
      }
    }
    
    return allCards;
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
    }
    else {
      this.selectedSheet = {sheetName: '', entries: []};
    }

    this.deactivateSplit();
    this.saveSheet();
  }

  public setSelectedColumns(front: string[], back: string[])
  {
    this._frontColumns = front;
    this._backColumns = back;
    this.saveColumns();
  }

  public setSplitInfos(nb: number, lastSelected: number)
  {
    this._splitInfos.nbSplit = nb;
    this._splitInfos.lastSelectedPack = lastSelected;
    this._splitInfos.useSplit = true;
    this.saveSplitInfos();
  }

  public deactivateSplit()
  {
    this._splitInfos.useSplit = false;
    this._splitInfos.lastSelectedPack = -1;
    this.saveSplitInfos();
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

  private saveSplitInfos()
  {
    localStorage.setItem(this.SPLIT_INFOS_KEY, JSON.stringify(this._splitInfos));
  }

  private load() {
    const fileData = localStorage.getItem(this.XLSX_FILE_KEY);
    const sheetData = localStorage.getItem(this.XLSX_SHEET_KEY);
    const frontColumnsData = localStorage.getItem(this.SELECTED_FRONT_COLUMNS_KEY);
    const backColumnsData = localStorage.getItem(this.SELECTED_BACK_COLUMNS_KEY);
    const splitInfosData = localStorage.getItem(this.SPLIT_INFOS_KEY);

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

    if(splitInfosData)
    {
      this._splitInfos = JSON.parse(splitInfosData);
    }

  }

  public emptyFilefromStorage() {
    this.xlsxFile = {fileName: '', sheets: []};
    this.selectedSheet = {sheetName: '', entries: []};
    this._splitInfos = {nbSplit: this._splitInfos.nbSplit, lastSelectedPack: -1, useSplit: false };

    this.saveFile();
    this.saveSheet();
    this.saveSplitInfos();
  }

}
