import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import * as pouchdbSize from 'pouchdb-size';
// PouchDB.plugin(require('pouchdb-size'));
// declare var require: any

PouchDB.plugin(pouchdbSize);

@Injectable({
  providedIn: 'root'
})
export class PouchSizeService {

  db;

  constructor() {
    PouchDB.on("created", (dbname: string) => {
      console.log("Database: '" + dbname + "' opened successfully.");
    });
  }

  createDB(dbName: string = 'jobs') {
    this.db = new PouchDB(dbName);
    this.db.installSizeWrapper();
    this.db.info().then((resp) => console.log(resp))
  }
}
