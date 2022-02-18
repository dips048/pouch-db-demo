import { Component, OnInit } from '@angular/core';
import { LoggerService, LogLevel } from '@dips048/angular-logger';
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
  counter = 0;
  // interval;

  constructor(
    private WorkerService: WorkerService,
    private pouchFindService: PouchFindService,
    private getHttpService: GetHttpService,
    private ls: LoggerService
  ) { }

  ngOnInit(): void {
    this.ls.registerComponent(this.constructor.name, LogLevel.Off);
  }


  usage() {
    navigator.storage.estimate().then(r => {
      const usage = Math.round(((r.usage/1048576)*100))/100;
      const quota = Math.round(((r.quota/1048576)*100))/100;
      console.log('quata',quota + "mb");
      console.log('usage',usage + "mb");
    })
  }

  startCounter() {
    // this.interval = setInterval(() => {
      this.counter++;
    // },1000)
  }

  stopCounter() {
    // clearInterval(this.interval)
  }

  clearCounter(){
    this.counter = 0;
  }

  createIndex() {
    // console.time('CI');
    this.pouchFindService.createIndex(`doc-images-${this.dbId}`, ['pageNumber']).then(r => {
      // console.timeEnd('CI');
    });
  }

  setPages(dbId: string) {
    this.getHttpService.getPagesData().subscribe(res => {
      // console.log('pages', res);
      // console.time("addBulkDocs");
      this.WorkerService.addBulkDocs(`doc-images-${dbId}`, res).then(r => {
        // console.timeEnd("addBulkDocs");
        // console.log("data added", r);
        // console.time('createIndex');
        this.pouchFindService.createIndex(`doc-images-${dbId}`, ['pageNumber']).then(r => {
          // console.timeEnd('createIndex');
        });
      });

      // this.pouchFindService.addBulkDocs(`doc-images-${dbId}`, res).then(r => {
      //   this.pouchFindService.createIndex(`doc-images-${dbId}`, ['pageNumber']);
      // })
    });
  }

  setTokens(dbId: string) {
    this.getHttpService.getTokensData().subscribe(res => {
      // console.log('tokens', res);
      this.WorkerService.addBulkDocs(`doc-tokens-${dbId}`, res).then(r => {
        this.pouchFindService.createIndex(`doc-tokens-${dbId}`, ['pageNumber']);
      })
      // this.pouchFindService.addBulkDocs(`doc-tokens-${dbId}`, res).then(r => {
      //   this.pouchFindService.createIndex(`doc-tokens-${dbId}`, ['pageNumber']);
      // })
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

  getAllDocIdsAndRevs() {
    // console.time('getAllDoc');
    this.WorkerService.getAllDocIdsAndRevs().then((docs: any) => {
      // console.timeEnd('getAllDoc');
      // console.log("all docs", docs);
    }).catch((err) => {
      // console.log(err);
    });
    // this.pouchFindService.getAllDocIdsAndRevs(`doc-images-${this.dbId}`).then((docs: any) => {
    //   console.log("all docs", docs);
    // }).catch((err) => {
    //   console.log(err);
    // });
  };

  findDocsByPageNumber(dbId: string, pageNumber: string = "1") {
    // console.time('findByPage Number');
    // this.ls.log(this.constructor.name, 'findPageByNumber');
    this.ls.startTimer('findPageByNumber');
    this.pouchFindService.findByPageNumber(`doc-tokens-${dbId}`, parseInt(pageNumber))
      .then((response: any) => {
        this.ls.stopTimer('findPageByNumber');
        this.ls.debug(this.constructor.name,'pages', response);
        // console.log(response);
        // console.timeEnd('findByPage Number');
      })
  }

  findDocsByPageValue(dbId: string, value: string) {
    // this.pouchFindService.createIndex(`doc-images-${dbId}`, ['value'])
    //   .then(() => {
      this.pouchFindService.findByPageNumber(`doc-tokens-${dbId}`, parseInt(value))
        .then((response: any) => {
          // console.log(response);
        })
      .catch((err: any) => {
        // console.log(err);
      });
  };

  addsingleImageDoc() {
    this.getHttpService.getPagesData().subscribe(res => {
      // console.log("res", res[0]);
      this.WorkerService.addSingleDoc(`doc-images-${this.dbId}`,res[0]).then((doc: any) => {
        // console.log('document added',doc);
      }).catch((err: any) => {
        // console.log(err);
      });
    })
  }

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

