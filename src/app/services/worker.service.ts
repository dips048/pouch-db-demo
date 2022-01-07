import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
// for this we have to add  "noImplicitAny": false to tsconfig file
import WorkerPouch from 'worker-pouch';
(<any>PouchDB).adapter('worker', WorkerPouch)

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  db: PouchDB.Database<{}>;

  constructor() {
    PouchDB.on("created", (dbname: string) => {
      console.log("Database: '" + dbname + "' opened successfully.");
    });
  }

  createDB(dbName: string = 'example') {
    this.db = new PouchDB(dbName, {adapter: 'worker'});
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
