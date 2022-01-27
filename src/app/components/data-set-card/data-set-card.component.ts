import { Component, Input, OnInit } from '@angular/core';
import { GetHttpService, WorkerService } from 'src/app/services';

@Component({
  selector: 'app-data-set-card',
  template: `
    <ng-container *ngIf="dataSet">
      <mat-card>
        <mat-card-title>
          <button mat-raised-button [routerLink]="['/pages', dataSetId]">{{dataSetId}}</button>
        </mat-card-title>
        <mat-card-subtitle>Total Pages: {{dataSet.totalPages}}</mat-card-subtitle>
        <button (click)="addDocuments(dataSetId)">Add Documents</button>
        AddedPages: {{addedPages}}
        <div>{{addedPages}}/{{dataSet.totalPages}} ===> {{(addedPages/dataSet.totalPages)*100 | number:'2.0-2'}} %</div>
      </mat-card>
    </ng-container>
  `,
})
export class DataSetCardComponent implements OnInit {

  @Input() dataSetId: string;
  dataSet: any;
  addedPages: 0;

  constructor(
    private workerService: WorkerService,
    private getHttpService: GetHttpService,
    ) { }

  ngOnInit(): void {
    this.workerService.getSingleDoc('data-set', this.dataSetId).then(response => {
      console.log(response);
      this.dataSet = response;
      this.getDocuments(this.dataSetId);
    }).catch(e => console.log(e));
  }

  addDocuments(id: string){
    this.getHttpService.getPagesData().subscribe(pages =>
      this.workerService.addBulkDocs(`doc-images-${id}`,pages).then(r => {
        // console.log(r);
        this.getDocuments(this.dataSetId);
      }).catch(e => console.log(e))
    );
  }

  getDocuments(id: string) {
    this.workerService.getAllDocIdsAndRevs(`doc-images-${id}`).then(r => {
      // console.log(r);
      this.addedPages = r.total_rows
    }).catch(e => console.log(e));
  }

}
