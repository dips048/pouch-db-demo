import { Component, Input, OnInit } from '@angular/core';
import { PouchFindService, WorkerService } from 'src/app/services';
import { Page } from '../../shared/models';


@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html',
  styleUrls: ['./document-card.component.scss']
})
export class DocumentCardComponent implements OnInit {

  @Input() pages: Page[];
  localDbpages: number;
  localDbRec: any;

  constructor(
    private workerService: WorkerService,
  ) { }

  ngOnInit(): void {
    this.workerService.addBulkDocs('dbname1',this.pages).then(r => console.log(r));
    this.getPagesFromIndexDb();
  }

  getPagesFromIndexDb() {
    this.workerService.getAllDocIdsAndRevs().then((docs: any) => {
      console.log("all docs", docs);
      this.localDbpages = docs.total_rows;
      this.localDbRec= docs.rows;
    }).catch((err) => {
      console.log(err);
    });
  }

  checkPage(id: string): boolean {
    let flag = false
    this.workerService.getSingleDoc(id).then(res => {
      console.log(res);
      if(res) { flag = true; }
    }).catch((error) => {
      console.log(error);
    });
    return flag;
  }

}
