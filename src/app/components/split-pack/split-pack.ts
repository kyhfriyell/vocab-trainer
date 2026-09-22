import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from '../../services/file-service';
import { Card } from "../card/card";
import { Button } from "../button/button";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-split-pack',
  imports: [Card, Button, NgClass],
  templateUrl: './split-pack.html',
  styleUrl: './split-pack.css',
})
export class SplitPack {
  private router = inject(Router);
  private fileService = inject(FileService);

  public wordCount = signal(0);
  public splitCount = signal(1);
  public lastSelectedPackIndex = signal(-1);

  ngOnInit() 
  {
      let sheet = this.fileService.sheet;
      this.wordCount.set(sheet.entries.length);

      let splitInfos = this.fileService.splitInfos;
      this.splitCount.set(splitInfos.nbSplit > Math.floor(this.wordCount()) / 2 ? 1 : splitInfos.nbSplit); // set to 1 if the initial split is too high
      this.lastSelectedPackIndex.set(splitInfos.lastSelectedPack > this.splitCount() -1 ? -1 : splitInfos.lastSelectedPack); // reset if last selected pack not showing 
  }

  get nbCardPerPack()
  {
    return Math.floor(this.wordCount() / this.splitCount());
  }

  public canIncreaseSplitCount(){
    return this.splitCount() <  Math.floor(this.wordCount() / 2);
  }

   public canDecreaseSplitCount(){
    return this.splitCount() > 1;
  }

  public increaseSplitCount()
  {
    let split = this.splitCount();
    
    let word = this.wordCount();
    if(split <  Math.floor(word / 2))
    {
      this.splitCount.set(split + 1);
    }
  }

  public decreaseSplitCount()
  {
    let count = this.splitCount();
    if(count > 1)
    {
      this.splitCount.set(count - 1);
    }
  }

  public isLastSelectedPack(index: number){
    return index == this.lastSelectedPackIndex();
  }

  public getCardsNumber(index: number)
  {
    
    let nbSplit = this.splitCount();
    let nbWords = this.wordCount();
    let nbCardsForPack = Math.floor(nbWords / nbSplit);
    if(index == nbSplit - 1)
    {
      nbCardsForPack += nbWords % nbSplit;
    }

    return nbCardsForPack;
  }

  public start(index: number)
  {
    this.fileService.setSplitInfos(this.splitCount(), index);
    this.router.navigate(['/study-space']);
  }


}
