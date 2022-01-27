import { Injectable } from '@angular/core';
import PouchDb from 'pouchdb-browser';
import PouchDB from 'pouchdb-browser';
import * as pouchdbSize from 'pouchdb-size';
// for this we have to add  "noImplicitAny": false to tsconfig file
import WorkerPouch from 'worker-pouch';
import { PouchFindService } from '.';

(<any>PouchDB).adapter('worker', WorkerPouch)
PouchDB.plugin(pouchdbSize);


@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  db: PouchDB.Database<{}>;
  dataSetDb: PouchDB.Database<{}>;

  constructor(
  ) {
    PouchDB.on("created", (dbname: string) => {
      // console.log("Database: '" + dbname + "' opened successfully.");
    });
    // this.createDataSetDb();
  }

  private createDB(dbName: string = 'example') {
    this.db = new PouchDB(dbName, {adapter: 'worker'});
    // if (dbName.split('-')[1] === 'images') {
    //   this.addDBNameToDataSetDb(dbName).then(r => {
    //     // {console.log(r)}
    //   })
    //   .catch(e => {
    //     // console.log(e)
    //   });
    // }
    // this.db.info().then(r => console.log(r));
  }

  private createDataSetDb() {
    this.dataSetDb = new PouchDB('data-set', {adapter: 'worker'});
  }

  addDBNameToDataSetDb(dbName: string,totalPages: number) {
    this.createDataSetDb();
    return this.dataSetDb.put({_id: dbName, totalPages: totalPages});
  }

  addBulkDocs(dbName:string, data: any[]){
    this.createDB(dbName);
    return this.db.bulkDocs(data);
    // return this.pouchFindService.createIndex(dbName, ['pageNumber']).then(() => {
    //   return this.pouchFindService.findByPageNumber(dbName, parseInt(data[0].pageNumber)).then(r => {
    //     if(r.docs.length){
    //       throw new Error('data already exist');
    //     }
    //     return this.db.bulkDocs(data);
    //   })
    // })

  };

  addSingleDoc(dbName:string, data: any): Promise<PouchDB.Core.Response> {
    this.createDB(dbName);
    return this.db.put(data);
  };

  getAllDocIdsAndRevs(dbName:string = 'example'): Promise<any> {
    this.createDB(dbName);
    return this.db.allDocs({include_docs: true});
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

  destroyDatabase(DBName:string ) {
    this.createDB(DBName);
    if (this.db) {
      this.db.destroy().then((response) => {
        // console.log("Database deleted.");
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
