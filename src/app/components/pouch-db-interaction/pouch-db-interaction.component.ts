import { Component, OnInit } from '@angular/core';
import { AngularLoggerService, LogLevel } from '@dips048/angular-logger';
import { DataSet, Page } from 'src/app/shared/models';
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
  totalPages = 300;
  projectName = 'project-1';
  dataSetName = 'data-set-1';

  constructor(
    private workerService: WorkerService,
    private pouchFindService: PouchFindService,
    private getHttpService: GetHttpService,
    private ls: AngularLoggerService
  ) {
    this.ls.registerComponent(this.constructor.name, LogLevel.Off);
  }

  ngOnInit(): void {
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
    this.counter++;
  }

  clearCounter(){
    this.counter = 0;
  }

  // createIndex() {
  //   // console.time('CI');
  //   this.pouchFindService.createIndex(`doc-images-${this.dbId}`, ['pageNumber']).then(r => {
  //     // console.timeEnd('CI');
  //   });
  // }

  setPages(dbId: string) {
    this.getHttpService.getPagesData().subscribe(res => {
      const requiredLength = res.headers.get('content-length') ? parseInt(res.headers.get('content-length')) : 0;
      navigator.storage.estimate().then(estimate => {
        const available = Math.floor((estimate.quota - estimate.usage));
        if(requiredLength >= available) {
          this.removeOldestDocImageDb();
        }
      }).then(() => this.addPages(`doc-images-${dbId}`, res.body))
      .catch(e => console.log(e))
    });
  }

  addPages(dbId: string, data: Page[]) {
    this.workerService.addBulkDocs(dbId, data).then(r => {
      this.addDbDataToProjectDb(dbId);
      console.log("data added", r);
    }).then(() => {
      console.time('createIndex');
      this.pouchFindService.createIndex(dbId, ['pageNumber']).then(r => console.timeEnd('createIndex'))
    }).catch(e => console.log(e));
  }

  setTokens(dbId: string) {
    this.getHttpService.getTokensData().subscribe(res => {
      // console.log('tokens', res);
      this.workerService.addBulkDocs(`doc-tokens-${dbId}`, res).then(r => {
        this.pouchFindService.createIndex(`doc-tokens-${dbId}`, ['pageNumber']).then();
      }).catch(e => console.log(e));
      // this.pouchFindService.addBulkDocs(`doc-tokens-${dbId}`, res).then(r => {
      //   this.pouchFindService.createIndex(`doc-tokens-${dbId}`, ['pageNumber']);
      // })
    });
  }

  generateDbId() {
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
    this.pouchFindService.destroyDatabase(`doc-images-${dbId}`);
    this.pouchFindService.destroyDatabase(`doc-tokens-${dbId}`);
  }

  getAllDocIdsAndRevs() {
    // console.time('getAllDoc');
    this.workerService.getAllDocIdsAndRevs().then((docs: any) => {
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
        this.ls.stopTimer(this.constructor.name, 'findPageByNumber');
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
      this.workerService.addSingleDoc(`doc-images-${this.dbId}`,res[0]).then((doc: any) => {
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

  addProject() {
    this.workerService.addSingleDoc('project', {_id: this.projectName}).then(r => console.log(r))
      .catch(e => console.log(e));
  }

  addDataSet() {
    this.workerService.getSingleDoc('project', this.projectName).then(r => {
      let dataSets = r.dataSets ?? [{dataSetName: this.dataSetName, docImageIds: []}];
      if (!dataSets.find(ele => ele.dataSetName === this.dataSetName)) {
        dataSets.push({dataSetName: this.dataSetName, docImageIds: [], totalPages: 0});
      }
      return this.workerService.editDoc('project', this.projectName, {dataSets}).then(r => console.log(r))
        .catch(e => console.log(e))
    }).catch(e => console.log(e));
  }

  addDbDataToProjectDb(id: string) {
    this.workerService.getSingleDoc('project', this.projectName).then(r => {
      let dataSets: DataSet[] = r.dataSets ? r.dataSets : [];
      if (!!dataSets.find(ele => ele.dataSetName === this.dataSetName)) {
        dataSets = dataSets.map(ds => {
          if(ds.dataSetName === this.dataSetName  && !ds.docImageIds.find(docImageId => docImageId.id === id)) {
            return {...ds, totalPages: ds.totalPages + this.totalPages, docImageIds: [...ds.docImageIds,  {id, date: new Date().getTime(), totalPages: this.totalPages}]}
          }
          return ds;
        });
      } else {
        dataSets.push({dataSetName: this.dataSetName, totalPages: this.totalPages, docImageIds: [{id, date: new Date().getTime(), totalPages: this.totalPages}]});
      }
      this.workerService.editDoc('project', this.projectName, {dataSets}).then(r => console.log(r)).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  async removeOldestDocImageDb() {
    await this.workerService.getAllDocIdsAndRevs('project').then(r => {
      let docImageIds = [];
      r.rows.map(row => row.doc.dataSets?.map(ds => {if(ds.docImageIds) {docImageIds.push(...ds.docImageIds)}}));
      docImageIds.sort((a,b) => a.date - b.date);
      // destroys the oldest pouchdb
      this.workerService.destroyDatabase(docImageIds[0].id).then(() => console.log(`${docImageIds[0].id} database deleted`))
        .catch(e => console.log(e));
      const originalDoc = r.rows.find(row => !!row.doc.dataSets.find(ds => !!ds.docImageIds.find(docImageId => docImageId.id === docImageIds[0].id)));
      const updatedDoc = originalDoc.doc.dataSets.map(ds => {
        const docImageIdsData = ds.docImageIds.filter(docImageId => docImageId.id != docImageIds[0].id)
        let totalPages = 0;
        docImageIdsData.map(docImage => {totalPages = totalPages + docImage.totalPages})
        return ({...ds, docImageIds: docImageIdsData, totalPages})
      });
      this.workerService.editDoc('project', originalDoc.id, {dataSets: updatedDoc}).then(r => console.log(r)).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
}

