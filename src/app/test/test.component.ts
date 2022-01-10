import { Component, OnInit } from '@angular/core';
import { GetHttpService, WorkerService } from '../services';
import { PouchFindService } from '../services/pouch-find.service';
import { TokenModel } from '../tokens.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  dbName:string = 'example'
  demoData = {
    _id: 'job_003',
    serviceDate: '2018-02-03',
    name: 'abc',
    customer: {
      name: "Mike Tinder"
    },
    technician: {
      EmployeeID: '1023',
      name: 'Sheriff, Paul'
    },
    workDone: [{
      description: 'Driveway repair',
      price: 225
    }]
  };
  job: any;
  tokens: TokenModel[];

  constructor(
    private WorkerService: WorkerService,
    private pouchFindService: PouchFindService,
    private getHttpService: GetHttpService
  ) { }

  ngOnInit(): void {
    this.createDatabase();
    this.getHttpService.getTokensData().subscribe(res => {
      console.log('res', res);
      if(res) {
        this.tokens = res;
      }
    })
  }

  createDatabase() {
    // this.WorkerService.createDB('jobs');
    // this.pouchFindService.createDB('jobs');
    // this.createIndexes();
  }

  addDocs() {
    this.WorkerService.addBulkDocs('example', this.tokens).then((docs: any) => {
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
  }

  countDocuments() {
    this.WorkerService.countDocuments().then((count: any) => {
      console.log("total rows", count);
    }).catch((err) => {
      console.log(err);
    });
  }

  addDoc() {
    this.WorkerService.addSingleDoc(this.demoData).then((doc: any) => {
      console.log('document added',doc);
    }).catch((err: any) => {
      console.log(err);
    });
  }

  getDoc() {
    this.WorkerService.getSingleDoc("job_003").then((doc: any) => {
      this.job = doc;
      console.log("data", doc);
    }).catch((err) => {
      console.log(err);
    });
  }

  updateJob() {
    this.WorkerService.updateData("job_003").then((doc: any) => {
      console.log("data updated", doc);
    }).catch((err) => {
      console.log(err);
    });
  };

  deleteJob() {
    this.WorkerService.deleteData("job_003").then((doc: any) => {
      console.log("data deleted");
    }).catch((err) => {
      console.log(err);
    });
  };

  compactDB(){
    this.WorkerService.compactDB();
  };

  destroyDatabase(){
    this.WorkerService.destroyDatabase(this.dbName);
  }

  createIndexes() {
    this.pouchFindService.createIndex(this.dbName,['pageNumber']).then((response: any) => {
      console.log('index added',response);
    }).catch((err: any) => {
      console.log(err);
    });
    this.pouchFindService.createIndex(this.dbName,['value']).then((response: any) => {
      console.log('index added',response);
    }).catch((err: any) => {
      console.log(err);
    });
  }

  find() {
    // this.createIndexes();
    this.pouchFindService.findByPageNumber(this.dbName,2).then((response: any) => {
      console.log(response);
    }).catch((err: any) => {
      console.log(err);
    });

    this.pouchFindService.findByPageValue(this.dbName).then((response: any) => {
      console.log(response);
    }).catch((err: any) => {
      console.log(err);
    });
  };

}
