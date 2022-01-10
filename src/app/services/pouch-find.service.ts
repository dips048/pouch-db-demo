import { Injectable } from '@angular/core';
import pouchFind from 'pouchdb-find';
import PouchDB from 'pouchdb-browser';

PouchDB.plugin(pouchFind);

@Injectable({
  providedIn: 'root'
})
export class PouchFindService {
  dbMaps = new Map();


  constructor() {
  }

  private createDB(dbName: string = 'jobs') {
    let db = this.dbMaps.get(dbName);
    if (!!db) {
    } else {
      db = new PouchDB(dbName);
      PouchDB.on("created", (dbname: string) => {
        console.log("Database: '" + dbname + "' opened successfully.");
      });
      this.dbMaps.set(dbName, db)
    }
    return db

  }

  destroyDatabase(dbName: string) {
   const db = this.createDB(dbName);

    if (db) {
      db.destroy().then((response) => {
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

  createIndex(dbName: string, index: Array<string>): Promise<PouchDB.Find.CreateIndexResponse<{}>> {
    const db = this.createDB(dbName);
    console.log(db);
    return db.createIndex({
      index: {
        fields: index
      }
    });
  };

  findByPageNumber(dbName: string, searchValue = 1): Promise<PouchDB.Find.FindResponse<{}>> {
    const db = this.createDB(dbName);
    return db.find({
      selector: { "pageNumber": searchValue },
      sort: ['pageNumber'],
      // fields: ['pageNumber', 'value', 'startIndex']
    })
  };

  findByPageValue(dbName: string, searchValue = "Exhibit"): Promise<PouchDB.Find.FindResponse<{}>> {
    const db = this.createDB(dbName);
    return db.find({
      selector: { "value": searchValue },
      sort: ['value'],
      // fields: ['pageNumber', 'value', 'startIndex']
    })
  };


}
