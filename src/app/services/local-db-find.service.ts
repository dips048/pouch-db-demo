import { Injectable } from '@angular/core';
import pouchFind from 'pouchdb-find';
import PouchDB from 'pouchdb-browser';

PouchDB.plugin(pouchFind);

@Injectable({
  providedIn: 'root'
})
export class LocalDbFindService {
  db: PouchDB.Database<{}>;

  constructor() {
    this.createDB();
    PouchDB.on("created", (dbname: string) => {
      console.log("Database: '" + dbname + "' opened successfully.");
    });
  }

  createDB(dbName: string = 'jobs') {
    this.db = new PouchDB(dbName);
  }

  createIndexes(indexes: Array<string>): Promise<PouchDB.Find.CreateIndexResponse<{}>> {
    return this.db.createIndex({
      index: {
        fields: indexes
      }
    });
  };

  findByPageNumber(searchValue = 1): Promise<PouchDB.Find.FindResponse<{}>> {
    return this.db.find({
      selector: { "pageNumber": searchValue },
      sort: ['pageNumber'],
      fields: ['pageNumber', 'value', 'startIndex']
    })
  };
}
