import { Injectable } from '@angular/core';
// import pouchFind from 'pouchdb-find';
import PouchDB from 'pouchdb';
import WorkerPouch from 'worker-pouch';

// (<any>PouchDB).adapter('worker', require('worker-pouch'));
// declare var require: any;

(<any>PouchDB).adapter('worker', WorkerPouch)

// PouchDB.plugin(pouchFind);

@Injectable({
  providedIn: 'root'
})
export class LocalDbService {
  db: PouchDB.Database<{}>;

  constructor() {
    PouchDB.on("created", (dbname: string) => {
      console.log("Database: '" + dbname + "' opened successfully.");
    });
  }

  createDB(dbName: string = 'jobs') {
    this.db = new PouchDB(dbName);
  }

  addBulkDocs(data: any[]){
    return this.db.bulkDocs(data);
  };

  addSingleDoc(data: any): Promise<PouchDB.Core.Response> {
    return this.db.put(data);
  };

  getAllDocIdsAndRevs(): Promise<any> {
    return this.db.allDocs();
  };

  countDocuments() {
    return this.db.allDocs({
      limit: 0,
      include_docs: false
    });
  }

  getSingleDoc(id: string): Promise<any> {
    return this.db.get(id);
  };

  // createIndexes(indexes: Array<string>): Promise<PouchDB.Find.CreateIndexResponse<{}>> {
  //   return this.db.createIndex({
  //     index: {
  //       fields: indexes
  //     }
  //   });
  // };

  // findByPageNumber(searchValue = 1): Promise<PouchDB.Find.FindResponse<{}>> {
  //   return this.db.find({
  //     selector: { "pageNumber": searchValue },
  //     sort: ['pageNumber'],
  //     fields: ['pageNumber', 'value', 'startIndex']
  //   })
  // };

  updateData(id: string): Promise<any> {
    return this.db.get(id)
      .then((doc: any) => {
        // Make changes
        doc.serviceDate = '2018-02-02';
        doc.technician.name = 'Sheriff, Paul2';
        // Update the document
        return this.db.put(doc);
      });
  };

  deleteData(id: string): Promise<any> {
    // Get the job
    return this.db.get(id)
      .then((doc) => {
        // Delete the job
        return this.db.remove(doc);
      });
  };

  compactDB(){
    if (this.db) {
      this.db.compact().then((doc: any) => {
        console.log("database compact", doc);
      }).catch((err) => {
        throw new Error(err);
      });
    }
    else {
      console.log("Please open the database first.");
    }
  };

  destroyDatabase() {
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

}
