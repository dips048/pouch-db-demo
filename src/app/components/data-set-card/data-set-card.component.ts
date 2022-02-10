import { Component, Input, OnInit } from '@angular/core';
import { DataSet } from 'src/app/shared/models';

@Component({
  selector: 'app-data-set-card',
  template: `
         <!-- <progress-bar [progress]="((addedPages/dataSet.totalPages)*100).toString()" [color-degraded]="{'0': '#00cbcb',  '15': '#f9c3d3', '25': '#fd8c8e'}"></progress-bar> -->
     <!-- <div class="flex float-right"><progress-bar [progress]="((addedPages/dataSet.totalPages)*100).toString()" [color-degraded]="{'0': '#00cbcb',  '15': '#f9c3d3', '25': '#fd8c8e'}"></progress-bar></div> -->
      <!-- <mat-card>
        <mat-card-title>
          {{dataSetId}}   Total Pages: {{dataSet.totalPages}}<progress-bar [progress]="((addedPages/dataSet.totalPages)*100).toString()" [color-degraded]="{'0': '#00cbcb',  '15': '#f9c3d3', '25': '#fd8c8e'}"></progress-bar>
        </mat-card-title> -->
        <!-- <mat-card-subtitle>Total Pages: {{dataSet.totalPages}}</mat-card-subtitle> -->
        <!-- <button (click)="addDocuments(dataSetId)">Add Documents</button> -->
        <!-- AddedPages: {{addedPages}}
        <div>{{addedPages}}/{{dataSet.totalPages}} ===> {{(addedPages/dataSet.totalPages)*100 | number:'2.0-2'}} %</div><br> -->
        <!-- <div> -->
          <!-- {{(addedPages/dataSet.totalPages)*100 | number:'2.0-2'}} % -->
          <!-- <mat-progress-bar
            class="example-margin"
            [color]="'primary'"
            [mode]="'determinate'"
            [value]="(addedPages/dataSet.totalPages)*100">
          </mat-progress-bar>
          <mat-progress-spinner
            class="example-margin"
            [color]="'primary'"
            [mode]="'determinate'"
            [value]="(addedPages/dataSet.totalPages)*100">
          </mat-progress-spinner>
          {{(addedPages/dataSet.totalPages)*100 | number:'2.0-2'}} %
        </div>
        <div>
          <circle-progress
            [percent]="(addedPages/dataSet.totalPages)*100"
            [radius]="50"
            [outerStrokeWidth]="8"
            [innerStrokeWidth]="4"
            [outerStrokeColor]="'#78C000'"
            [innerStrokeColor]="'#C7E596'"
            [animation]="true"
            [animationDuration]="300">
          </circle-progress>
          <circle-progress
            [percent]="(addedPages/dataSet.totalPages)*100"
            [backgroundColor]="'#FDB900'"
            [radius]="50"
            [units]="'Point'"
            [unitsColor]="'#483500'"
            [titleColor]="'#483500'"
            [subtitleColor]="'#483500'"
            [showSubtitle]="false"
            [showInnerStroke]="false"
            [startFromZero]="false"
            [outerStrokeWidth]="5"
            [outerStrokeColor]="'#FFFFFF'"
            [innerStrokeColor]="'#FFFFFF'"
            [animation]="true"
            [animationDuration]="300">
          </circle-progress>
          <circle-progress
          [percent]="(addedPages/dataSet.totalPages)*100"
          [backgroundColor]="'#F1F1F1'"
          [backgroundPadding]="-18"
          [radius]="60"
          [toFixed]="2"
          [outerStrokeWidth]="10"
          [outerStrokeColor]="'#FF6347'"
          [innerStrokeColor]="'#32CD32'"
          [innerStrokeWidth]="1"
          [startFromZero]="false">
          </circle-progress>

          <circle-progress
            [percent]="(addedPages/dataSet.totalPages)*100"
            [backgroundPadding]="7"
            [radius]="60"
            [space]="-2"
            [outerStrokeWidth]="2"
            [innerStrokeWidth]="2"
            [outerStrokeColor]="'#808080'"
            [innerStrokeColor]="'#e7e8ea'"
            [title]="['working', 'in', 'progress']"
            [titleFontSize]="'12'"
            [subtitleFontSize]="'20'"
            [animateTitle]="false"
            [animationDuration]="1000"
            [showUnits]="false"
            [clockwise]="false">
          </circle-progress> -->
        <!-- </div> -->
      <!-- </mat-card> -->
    <div class="column small-1">{{dataSets.dataSetName}}</div>
    <div class="column small-2">Total Pages: {{dataSets.totalPages}}</div>
    <div class="column small-2">completed: {{((addedPages)/dataSets.totalPages)*100 | number:'2.0-2'}}%</div>
    <div class="column small-5">
      <mat-progress-bar
        class="example"
        [color]="'primary'"
        [mode]="'determinate'"
        [value]="(addedPages/dataSets.totalPages)*100">
      </mat-progress-bar>
    </div>
    <div class="column" *ngFor="let docImage of dataSets.docImageIds">
      <app-doc-image-card [docImageId]="docImage.id" [totalPages]="docImage.totalPages" (pages)="setAddedPages($event)"></app-doc-image-card>
    </div>
  `,
  styles:[`
    .example {
      display: flex;
      align-content: center;
      align-items: center;
      height: 10px;
    }
  `],
})
export class DataSetCardComponent implements OnInit {

  @Input() dataSets: DataSet;
  addedPages = 0;

  constructor() { }

  ngOnInit(): void {
  }

  setAddedPages(val: number) {
    this.addedPages = this.addedPages + val;
  }
}


