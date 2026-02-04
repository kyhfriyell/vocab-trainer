import { Component, inject, OnInit, signal } from '@angular/core';
import { FileService } from '../../services/file-service';
import { Sheet } from "./sheet/sheet";
import { Router } from '@angular/router';

@Component({
  selector: 'app-xsls-sheet-chooser',
  imports: [Sheet],
  templateUrl: './xlsx-sheet-chooser.html',
  styleUrl: './xlsx-sheet-chooser.scss',
})
export class XlsxSheetChooser implements OnInit {

  private router = inject(Router);
  private fileService = inject(FileService);
  public sheets: any[] = [];

  ngOnInit() 
  {
    this.sheets = [...this.fileService.file.sheets];
  }

  onSheetClicked(name: string){
    this.fileService.selectSheet(name);
    this.router.navigate(['sheet-infos']);
  }
}
