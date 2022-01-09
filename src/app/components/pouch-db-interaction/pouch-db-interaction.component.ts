import { Component, OnInit } from '@angular/core';
import { GetHttpService, WorkerService } from '../../services';
import { PouchFindService } from '../../services';
import { TokenModel } from '../../tokens.model';

@Component({
  selector: 'app-pouch-db-interaction',
  templateUrl: './pouch-db-interaction.component.html',
  styleUrls: ['./pouch-db-interaction.component.scss']
})
export class PouchDbInteractionComponent implements OnInit {
  dbId: string = "dbname1"
  pages: any;
  tokens: TokenModel[];

  constructor(
    private WorkerService: WorkerService,
    private pouchFindService: PouchFindService,
    private getHttpService: GetHttpService
  ) { }

  ngOnInit(): void {

  }

  setPages(dbId: string) {
    this.getHttpService.getPagesData().subscribe(res => {
      console.log('pages', res);
      this.WorkerService.addBulkDocs(`doc-images-${dbId}`, res);

    });
  }

  setTokens(dbId: string) {
    this.getHttpService.getTokensData().subscribe(res => {
      console.log('tokens', res);
      this.WorkerService.addBulkDocs(`doc-tokens-${dbId}`, res);;
    });
  }

  generateDbId() {
    // this.WorkerService.createDB(dbName);
    // this.pouchFindService.createDB(dbName);
    this.dbId = this.generateUUID();
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


  destroyDatabase(dbId: string) {
    // this.WorkerService.destroyDatabase(DBName);
    this.pouchFindService.destroyDatabase(`doc-images-${dbId}`);
    this.pouchFindService.destroyDatabase(`doc-tokens-${dbId}`);
  }

  addDocs(dbName: string, data: any[]) {
    // this.WorkerService.createDB(dbName);

    this.pouchFindService.findByPageValue()

    this.WorkerService.addBulkDocs(dbName, data).then((docs: any) => {
      console.log('bulk of documents added', docs);
    }).catch((err: any) => {
      console.log(err);
    });
  }

  getAllDocIdsAndRevs() {
    this.WorkerService.getAllDocIdsAndRevs().then((docs: any) => {
      console.log("all docs", docs);
    }).catch((err) => {
      console.log(err);
    });
  };

  findDocsByPageNumber(dbId: string, pageNumber: string = "1") {
    this.pouchFindService.createIndex(`doc-tokens-${dbId}`, ['pageNumber']).then(() => {
      this.pouchFindService.findByPageNumber(parseInt(pageNumber)).then((response: any) => {
        console.log(response);
      })
    }).catch((err: any) => {
      console.log(err);
    });
  }

  findDocsByPageValue(dbId: string, value: string) {
    this.pouchFindService.createIndex(`doc-images-${dbId}`, ['value']).then(() => {
      this.pouchFindService.findByPageValue((value)).then((response: any) => {
        console.log(response);
      })
    }).catch((err: any) => {
      console.log(err);
    });
  };


  // addDoc() {
  //   this.WorkerService.addSingleDoc(this.demoData).then((doc: any) => {
  //     console.log('document added',doc);
  //   }).catch((err: any) => {
  //     console.log(err);
  //   });
  // }

  // getDoc() {
  //   this.WorkerService.getSingleDoc("job_003").then((doc: any) => {
  //     this.job = doc;
  //     console.log("data", doc);
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }

  // updateJob() {
  //   this.WorkerService.updateData("job_003").then((doc: any) => {
  //     console.log("data updated", doc);
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // };

  // deleteJob() {
  //   this.WorkerService.deleteData("job_003").then((doc: any) => {
  //     console.log("data deleted");
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // };

  // compactDB(){
  //   this.WorkerService.compactDB();
  // };

}

