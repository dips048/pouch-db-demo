import { Injectable } from '@angular/core';
import pouchFind from 'pouchdb-find';
import PouchDB from 'pouchdb-browser';

PouchDB.plugin(pouchFind);

@Injectable({
  providedIn: 'root'
})
export class PouchFindService {
  db: PouchDB.Database<{}>;

  constructor() {
    PouchDB.on("created", (dbname: string) => {
      console.log("Database: '" + dbname + "' opened successfully.");
    });
  }

 private createDB(dbName: string = 'jobs') {
    this.db = new PouchDB(dbName);
  }

  destroyDatabase(dbName: string) {
    this.createDB(dbName);

    if (this.db) {
      this.db.destroy().then((response) => {
        console.log("Database deleted.");
      }).catch((err) => {
        throw new Error(err);
      });
    }
    else {
      console.log("Please open the database first.");
      throw new Error("Please open the database first.");
    }
  };

  createIndex(dbName:string, index: Array<string>): Promise<PouchDB.Find.CreateIndexResponse<{}>> {
    this.createDB(dbName);
    console.log(this.db);
    return this.db.createIndex({
      index: {
        fields: index
      }
    });
  };

  findByPageNumber(searchValue = 1): Promise<PouchDB.Find.FindResponse<{}>> {
    return this.db.find({
      selector: { "pageNumber": searchValue },
      sort: ['pageNumber'],
      // fields: ['pageNumber', 'value', 'startIndex']
    })
  };

  findByPageValue(searchValue = "Exhibit"): Promise<PouchDB.Find.FindResponse<{}>> {
    return this.db.find({
      selector: { "value": searchValue },
      sort: ['value'],
      // fields: ['pageNumber', 'value', 'startIndex']
    })
  };


}
