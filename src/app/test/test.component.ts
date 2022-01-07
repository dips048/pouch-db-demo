import { Component, OnInit } from '@angular/core';
import { LocalDbService } from '../services';

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

  constructor(
    private localDbService: LocalDbService
  ) { }

  ngOnInit(): void {
    this.localDbService.createDB('jobs');
    this.createIndexes();
  }

  addJob() {
    this.localDbService.addSingleDoc(this.data).then((doc: any) => {
      console.log('document added',doc);
    }).catch((err: any) => {
      throw new Error(err);
    });
  }

  getJob() {
    this.localDbService.getSingleDoc("job_003").then((doc: any) => {
      this.job = doc;
      console.log("data", doc);
    }).catch((err) => {
      throw new Error(err);
    });
  }

  createIndexes() {
    this.localDbService.createIndexes(['name']).then((response: any) => {
      console.log('index added',response);
    }).catch((err: any) => {
      throw new Error(err);
    });
  }

  find() {
    this.localDbService.findName().then((response: any) => {
      console.log(response);
    }).catch((err: any) => {
      throw new Error(err);
    });
  };

  updateJob() {
    this.localDbService.updateData("job_003").then((doc: any) => {
      console.log("data updated", doc);
    }).catch((err) => {
      throw new Error(err);
    });
  };

  deleteJob() {
    this.localDbService.deleteData("job_003").then((doc: any) => {
      console.log("data deleted");
    }).catch((err) => {
      throw new Error(err);
    });
  };

  compactDB(){
    this.localDbService.compactDB();
  };

  destroyDatabase(){
    this.localDbService.destroyDatabase();
  }

}
