import { Component, Input, OnInit } from '@angular/core';
import { GetHttpService, WorkerService } from 'src/app/services';

@Component({
  selector: 'app-document',
  template: `
    <button (click)="addDocuments(id)">Add Documents</button>
    AddedPages: {{docLength}}
  `
})
export class DocumentComponent implements OnInit {

  @Input() id: string;
  docLength: 0;

  constructor(
    private getHttpService: GetHttpService,
    private workerService: WorkerService
    ) { }

  ngOnInit(): void {
    this.getDocuments(this.id);
  }

  addDocuments(id: string,){
    this.getHttpService.getPagesData().subscribe(pages =>
      this.workerService.addBulkDocs(id,pages).then(r => {
        console.log(r);
        this.getDocuments(this.id);
      }).catch(e => console.log(e))
    );
  }

  getDocuments(id: string) {
    this.workerService.getAllDocIdsAndRevs(id).then(r => {
      console.log(r);
      this.docLength = r.total_rows
    }).catch(e => console.log(e));
  }

}
