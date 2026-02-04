import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from '../../services/file-service';
import { StudiesEnded } from "./studies-ended/studies-ended";
import { Card } from "../card/card";
import { StudyContent } from "../card/study-content/study-content";

@Component({
  selector: 'app-study-space',
  imports: [StudiesEnded, Card, StudyContent],
  templateUrl: './study-space.html',
  styleUrl: './study-space.css',
})
export class StudySpace implements OnInit {

  private router = inject(Router);
  private fileService = inject(FileService);

  public totalWords!: number;
  public succeededWords!: number;
  public forgotten!: number;
  public cards: any[] = [];
  public index!: number;
  public showFront!: boolean;
  public showActions!: boolean;

  ngOnInit()
  {
    this.reset();
  }

  public reset()
  {
    this.cards = [...this.fileService.sheet.entries];
    this.totalWords = this.cards.length;
    this.shuffle(this.cards);
    this.succeededWords = 0;
    this.forgotten = 0;
    this.index = 0;
    this.showFront = true;
    this.showActions = false;
  }

  private shuffle(array: any[]) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      var temp = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temp;
    }
  }

  get sheetName() 
  {
    return this.fileService.sheet.sheetName;
  }

  get card()
  {
    return this.cards[this.index];
  }

  get frontColumns()
  {
    return this.fileService.frontColumns;
  }

  get backColumns()
  {
    return this.fileService.backColumns;
  }

  onFlipCard()
  {
    this.showFront = !this.showFront;
    this.showActions = true;
  }

  onNext()
  {
    this.cards.splice(this.index, 1);
    this.succeededWords++;
    this.checkEndOfPack();
  }

  onForgot()
  {
    this.index++;
    this.forgotten++;
    this.checkEndOfPack();
  }

  private checkEndOfPack()
  {
    if(this.index >= this.cards.length)
    {
      if(this.succeededWords === this.totalWords)
      {
        this.index = 0;
        // go to finished page (redo, back to sheet selection) // prevent back on study-place
        // or just show a dialog on top of the view
      }
      else
      {
        this.shuffle(this.cards);
        this.index = 0;
      }
    }

    this.showFront = true;
    this.showActions = false;
  }

 

}
