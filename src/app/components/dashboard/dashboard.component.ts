import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkerService } from 'src/app/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dataSetRows: any[];
  dbId: string = "dbname1";
  totalPages = 300;

  constructor(
    private workerService: WorkerService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getAllDataset();
    // this.workerService.dataSetDb.changes().on('complete', () => this.router.navigate(['/dashboard']).then())
  }

  generateDbId() {
    this.dbId = this.generateUUID();
    this.workerService.addDBNameToDataSetDb(this.dbId, this.totalPages).then(r => console.log(r))
        .catch(e => console.log(e));
  }

  generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if (d > 0) {//Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {//Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  // addDataSetDoc(totalPages: string) {
  //   this.workerService.addDBNameToDataSetDb(this.dbId, parseInt(totalPages)).then(r => console.log(r))
  //   .catch(e => console.log(e));
  // }

  getAllDataset() {
    this.workerService.getAllDocIdsAndRevs('data-set').then(r => this.dataSetRows = r.rows)
    .catch(e => console.log(e))
  }
}
