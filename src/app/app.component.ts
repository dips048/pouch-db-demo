import { Component, OnInit } from '@angular/core';
// const PouchDB = require('pouchdb');

// const pouchDB = PouchDB.default.defaults('pouchdb');

import pouchFind from 'pouchdb-find';

// pouchDB.plugin(pouchFind);
// declare var require: any;
// import { plugin } from 'pouchdb';
import PouchDB from 'pouchdb';

PouchDB.plugin(pouchFind);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'pouch-db-demo';
  // db = new PouchDB('jobs');

  ngOnInit(): void {
    // PouchDB.on("created", function (dbname: string) {
    //   console.log("Database: '" + dbname + "' opened successfully.");
    // });
    // this.addJob();
    // this.createIndexes();
  }

  // addJob() {
  //   this.db.put({
  //     "_id": 'job_003',
  //     "serviceDate": '2018-02-03',
  //     "name": 'abc',
  //     "customer": {
  //       "name": "Mike Tinder"
  //     },
  //     "technician": {
  //       "EmployeeID": '1023',
  //       "name": 'Sheriff, Paul'
  //     },
  //     "workDone": [{
  //       "description": 'Driveway repair',
  //       "price": 225
  //     }]
  //   }).then(function (response) {
  //     console.log(response);
  //     console.log('job added')
  //   }).catch(function (err) {
  //     console.log(err);
  //   });
  // }


  // createIndexes() {

    // Create index on invoice total
    // this.db.createIndex({
    //   index: {
    //     fields: ['invoiceTotal']
    //   }
    // }).then(function (response: any) {
    //   console.log(response)
    // }).catch(function (err: any) {
    //   console.log(err);
    // });

  //   this.db.createIndex({
  //     index: {
  //       fields: ['name']
  //     }
  //   }).then(function (response: any) {
  //     console.log('index added',response);
  //   }).catch(function (err: any) {
  //     console.log(err);
  //   });
  // }

  // findACustomer() {
  //   let search = "abc";
  //   this.db.find({
  //     selector: { "name": search },
  //     sort: ['name']
  //   }).then(function (response) {
  //     console.log(response);
  //   }).catch(function (err) {
  //     console.log(err)
  //   });
  // }

}
