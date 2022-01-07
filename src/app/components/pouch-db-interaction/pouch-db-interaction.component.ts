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

  pages: any;
  tokens: TokenModel[];

  constructor(
    private WorkerService: WorkerService,
    private pouchFindService: PouchFindService,
    private getHttpService: GetHttpService
  ) { }

  ngOnInit(): void {
    this.getHttpService.getTokensData().subscribe(res => {
      console.log('tokens', res);
      if(res) {
        this.tokens = res;
      }
    });
    this.getHttpService.getPagesData().subscribe(res => {
      console.log('pages', res);
      if(res) {
        this.pages = res;
      }
    })
  }

  createDatabase(dbName: string) {
    this.WorkerService.createDB(dbName);
    this.pouchFindService.createDB(dbName);
  }

  destroyDatabase(){
    this.WorkerService.destroyDatabase();
    this.pouchFindService.destroyDatabase();
  }

  addDocs(data: any[]) {
    this.WorkerService.addBulkDocs(data).then((docs: any) => {
      console.log('bulk of documents added',docs);
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

  findDocsByPageNumber(pageNumber: string = "1") {
    this.pouchFindService.createIndex(['pageNumber']).then(() => {
      this.pouchFindService.findByPageNumber(parseInt(pageNumber)).then((response: any) => {
        console.log(response);
      })
    }).catch((err: any) => {
      console.log(err);
    });
  }

  findDocsByPageValue(value: string) {
    this.pouchFindService.createIndex(['value']).then(() => {
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

