import { Component, OnInit } from '@angular/core';
import { LocalDbService } from '../services';
import { LocalDbFindService } from '../services/local-db-find.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  data = {
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
  }
  job: any;
  datas = [
    {
      endIndex: 7,
      height: 11,
      pageNumber: 1,
      startIndex: 0,
      value: 'Exhibit',
      width: 126,
      xPosition: 2222,
      yPosition: 152
    },
    {
      endIndex: 7,
      height: 12,
      pageNumber: 2,
      startIndex: 0,
      value: 'Exhibit',
      width: 126,
      xPosition: 2222,
      yPosition: 152
    },
    {
      endIndex: 7,
      height: 11,
      pageNumber: 3,
      startIndex: 0,
      value: 'Exhibit',
      width: 126,
      xPosition: 2222,
      yPosition: 152
    }
  ];

  constructor(
    private localDbService: LocalDbService,
    private localDbFindService: LocalDbFindService
  ) { }

  ngOnInit(): void {
    this.createDatabase();
    this.createIndexes();
  }

  createDatabase() {
    this.localDbService.createDB('jobs');
  }

  addDocs() {
    this.localDbService.addBulkDocs(this.datas).then((docs: any) => {
      console.log('bulk of documents added',docs);
    }).catch((err: any) => {
      console.log(err);
    });
  }

  addDoc() {
    this.localDbService.addSingleDoc(this.data).then((doc: any) => {
      console.log('document added',doc);
    }).catch((err: any) => {
      console.log(err);
    });
  }

  getDoc() {
    this.localDbService.getSingleDoc("job_003").then((doc: any) => {
      this.job = doc;
      console.log("data", doc);
    }).catch((err) => {
      console.log(err);
    });
  }

  getAllDocIdsAndRevs() {
    this.localDbService.getAllDocIdsAndRevs().then((docs: any) => {
      console.log("all docs", docs);
    }).catch((err) => {
      console.log(err);
    });
  }

  countDocuments() {
    this.localDbService.countDocuments().then((count: any) => {
      console.log("total rows", count);
    }).catch((err) => {
      console.log(err);
    });
  }


  createIndexes() {
    this.localDbFindService.createIndexes(['pageNumber']).then((response: any) => {
      console.log('index added',response);
    }).catch((err: any) => {
      console.log(err);
    });
  }

  find() {
    this.localDbFindService.findByPageNumber(2).then((response: any) => {
      console.log(response);
    }).catch((err: any) => {
      console.log(err);
    });
  };

  updateJob() {
    this.localDbService.updateData("job_003").then((doc: any) => {
      console.log("data updated", doc);
    }).catch((err) => {
      console.log(err);
    });
  };

  deleteJob() {
    this.localDbService.deleteData("job_003").then((doc: any) => {
      console.log("data deleted");
    }).catch((err) => {
      console.log(err);
    });
  };

  compactDB(){
    this.localDbService.compactDB();
  };

  destroyDatabase(){
    this.localDbService.destroyDatabase();
  }

}
