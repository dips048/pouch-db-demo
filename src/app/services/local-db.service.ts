import { Injectable } from '@angular/core';
import pouchFind from 'pouchdb-find';
import PouchDB from 'pouchdb';

PouchDB.plugin(pouchFind);;

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

  createDB(dbName: string) {
    this.db = new PouchDB(dbName);
  }

  addSingleDoc(data: any): Promise<PouchDB.Core.Response> {
    return this.db.put(data);
  }

  getSingleDoc(id: string): Promise<any> {
    return this.db.get(id);
  }

  createIndexes(indexes: Array<string>): Promise<PouchDB.Find.CreateIndexResponse<{}>> {
    return this.db.createIndex({
      index: {
        fields: indexes
      }
    });
  }

  findName(searchValue: string = "abc"): Promise<PouchDB.Find.FindResponse<{}>> {
    return this.db.find({
      selector: { "name": searchValue },
      sort: ['name']
    })
  }

  updateData(id: string): Promise<any> {
    return this.db.get(id)
      .then((doc: any) => {
        // Make changes
        doc.serviceDate = '2018-02-02';
        doc.technician.name = 'Sheriff, Paul2';
        // Update the document
        return this.db.put(doc);
      });
  }

  deleteData(id: string): Promise<any> {
    // Get the job
    return this.db.get(id)
      .then((doc) => {
        // Delete the job
        return this.db.remove(doc);
      });
  }

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
  }

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
