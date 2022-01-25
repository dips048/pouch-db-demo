import { Component, Input, OnInit } from '@angular/core';
import { GetHttpService, WorkerService } from 'src/app/services';

@Component({
  selector: 'app-data-set-card',
  template: `
    <ng-container *ngIf="dataSet">
      <mat-card class="example-card">
        <mat-card-title>Id: {{dataSetId}}</mat-card-title>
        <mat-card-subtitle>Total Pages: {{dataSet.totalPages}}</mat-card-subtitle>
        <!-- <app-document [id]="dataSetId"></app-document> -->
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
    this.workerService.getSingleDoc(this.dataSetId).then(response => {
      console.log(response);
      this.dataSet = response;
      this.getDocuments(this.dataSetId);
    }).catch(e => console.log(e));
  }

  addDocuments(id: string,){
    this.getHttpService.getPagesData().subscribe(pages =>
      this.workerService.addBulkDocs(id,pages).then(r => {
        console.log(r);
        this.getDocuments(this.dataSetId);
      }).catch(e => console.log(e))
    );
  }

  getDocuments(id: string) {
    this.workerService.getAllDocIdsAndRevs(id).then(r => {
      console.log(r);
      this.addedPages = r.total_rows
    }).catch(e => console.log(e));
  }

}
